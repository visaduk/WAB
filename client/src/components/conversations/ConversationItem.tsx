import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../common/Avatar';
import type { Conversation } from '../../types';

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: Props) {
  const contact = conversation.contact;
  const displayName = contact.name || contact.profileName || contact.phoneNumber;
  const lastMsg = conversation.lastMessage;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 ${
        isActive ? 'bg-green-50 border-l-2 border-l-green-600' : 'hover:bg-gray-50'
      }`}
    >
      <Avatar name={displayName} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900 truncate text-sm">{displayName}</span>
          {lastMsg && (
            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
              {formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: true })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-gray-500 truncate">
            {lastMsg ? (
              <>
                {lastMsg.direction === 'outbound' && <span className="text-gray-400">You: </span>}
                {lastMsg.text}
              </>
            ) : (
              'No messages yet'
            )}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
              {conversation.unreadCount}
            </span>
          )}
        </div>
        {conversation.assignedTo && (
          <span className="text-xs text-blue-500 mt-0.5 block">{conversation.assignedTo.name}</span>
        )}
      </div>
    </button>
  );
}
