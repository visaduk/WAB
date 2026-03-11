import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConversation, markConversationRead } from '../../api/conversations';
import { useMessages } from '../../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { AgentAssignment } from '../agents/AgentAssignment';
import { Avatar } from '../common/Avatar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { X, Clock } from 'lucide-react';

interface Props {
  conversationId: string;
  onClose: () => void;
}

export function ChatView({ conversationId, onClose }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId),
  });

  const { data: messagesData, isLoading, refetch } = useMessages(conversationId);

  useEffect(() => {
    if (conversationId) {
      markConversationRead(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData?.messages]);

  if (!conversation) return <LoadingSpinner />;

  const contact = conversation.contact;
  const displayName = contact.name || contact.profileName || contact.phoneNumber;

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="h-16 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={displayName} />
          <div>
            <h3 className="font-medium text-gray-900 text-sm">{displayName}</h3>
            <p className="text-xs text-gray-500">{contact.phoneNumber}</p>
          </div>
          {conversation.isWithinWindow && (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <Clock size={12} /> Window active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <AgentAssignment conversationId={conversationId} currentAgent={conversation.assignedTo} />
          <select
            value={conversation.status}
            onChange={async (e) => {
              const { updateConversationStatus } = await import('../../api/conversations');
              await updateConversationStatus(conversationId, e.target.value);
            }}
            className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {messagesData?.messages.map((msg) => (
              <MessageBubble key={msg._id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        isWithinWindow={conversation.isWithinWindow}
        onMessageSent={() => refetch()}
      />
    </div>
  );
}
