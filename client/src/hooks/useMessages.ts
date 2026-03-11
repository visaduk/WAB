import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMessages } from '../api/conversations';
import { useSocket } from '../context/SocketContext';
import type { Message } from '../types';

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('join_conversation', conversationId);

    const handleNewMessage = (data: { message: Message; conversation: any }) => {
      if (data.message.conversation === conversationId ||
          (data.message.conversation as any)?._id === conversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      }
    };

    const handleStatusUpdate = (data: { messageId: string; status: string }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_status', handleStatusUpdate);

    return () => {
      socket.emit('leave_conversation', conversationId);
      socket.off('new_message', handleNewMessage);
      socket.off('message_status', handleStatusUpdate);
    };
  }, [socket, conversationId, queryClient]);

  return query;
}
