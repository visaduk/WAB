import { format } from 'date-fns';
import { Check, CheckCheck, Clock, AlertCircle, MapPin, FileText, Play } from 'lucide-react';
import type { Message } from '../../types';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isOutbound = message.direction === 'outbound';

  const statusIcon = () => {
    if (!isOutbound) return null;
    switch (message.status) {
      case 'pending':
        return <Clock size={14} className="text-gray-400" />;
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      case 'failed':
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="text-sm whitespace-pre-wrap break-words">{message.text?.body}</p>;

      case 'image':
        return (
          <div>
            {message.media?.url ? (
              <img src={message.media.url} alt="" className="max-w-xs rounded-lg" />
            ) : (
              <div className="bg-gray-200 rounded-lg p-4 text-sm text-gray-500 flex items-center gap-2">
                <FileText size={16} /> Image
              </div>
            )}
            {message.media?.caption && (
              <p className="text-sm mt-1">{message.media.caption}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="bg-gray-200 rounded-lg p-4 text-sm text-gray-500 flex items-center gap-2">
            <Play size={16} /> Video
            {message.media?.caption && <span>- {message.media.caption}</span>}
          </div>
        );

      case 'audio':
        return (
          <div className="bg-gray-200 rounded-lg p-3 text-sm text-gray-500 flex items-center gap-2">
            <Play size={16} /> Audio message
          </div>
        );

      case 'document':
        return (
          <div className="bg-gray-200 rounded-lg p-3 text-sm flex items-center gap-2">
            <FileText size={16} className="text-gray-600" />
            <span className="text-gray-700">{message.media?.filename || 'Document'}</span>
          </div>
        );

      case 'location':
        return (
          <div className="bg-gray-200 rounded-lg p-3 text-sm flex items-center gap-2">
            <MapPin size={16} className="text-red-500" />
            <div>
              {message.location?.name && <p className="font-medium">{message.location.name}</p>}
              {message.location?.address && <p className="text-gray-500 text-xs">{message.location.address}</p>}
              <p className="text-xs text-gray-400">
                {message.location?.latitude}, {message.location?.longitude}
              </p>
            </div>
          </div>
        );

      case 'interactive':
        if (message.direction === 'inbound') {
          const reply = message.interactive?.buttonReply || message.interactive?.listReply;
          return (
            <div className="text-sm">
              <p className="text-blue-600 font-medium">{reply?.title || 'Reply'}</p>
              {message.interactive?.listReply?.description && (
                <p className="text-xs text-gray-500">{message.interactive.listReply.description}</p>
              )}
            </div>
          );
        }
        return (
          <div className="text-sm">
            {message.interactive?.body && <p>{(message.interactive.body as any).text}</p>}
            {message.interactive?.action && (
              <div className="mt-2 space-y-1">
                {(message.interactive.action as any)?.buttons?.map((btn: any, i: number) => (
                  <div key={i} className="border border-blue-300 rounded px-3 py-1 text-center text-blue-600 text-xs">
                    {btn.reply?.title || btn.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'template':
        return (
          <div className="text-sm">
            <p className="text-gray-500 italic">Template: {message.template?.name}</p>
          </div>
        );

      default:
        return <p className="text-sm text-gray-500 italic">{message.type} message</p>;
    }
  };

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          isOutbound ? 'bg-green-100 rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'
        }`}
      >
        {renderContent()}
        <div className={`flex items-center gap-1 mt-1 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-400">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          {isOutbound && message.sentBy && (
            <span className="text-xs text-gray-400">- {(message.sentBy as any).name}</span>
          )}
          {statusIcon()}
        </div>
        {message.status === 'failed' && message.failedReason && (
          <p className="text-xs text-red-500 mt-1">{message.failedReason}</p>
        )}
      </div>
    </div>
  );
}
