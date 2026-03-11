import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getConversations } from '../api/conversations';
import { useSocket } from '../context/SocketContext';
import type { Conversation, Message } from '../types';

export function useConversations(filters?: {
  status?: string;
  assignedTo?: string;
  search?: string;
}) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery({
    queryKey: ['conversations', filters],
    queryFn: () => getConversations(filters),
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { conversation: Conversation; message: Message }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    const handleAssignment = (data: { conversation: Conversation }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('conversation_assigned', handleAssignment);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('conversation_assigned', handleAssignment);
    };
  }, [socket, queryClient]);

  return query;
}
