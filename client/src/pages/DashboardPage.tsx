import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { ConversationList } from '../components/conversations/ConversationList';
import { ChatView } from '../components/chat/ChatView';
import { MessageSquare } from 'lucide-react';

export function DashboardPage() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  return (
    <>
      <Header title="Conversations" />
      <div className="flex-1 flex overflow-hidden">
        <ConversationList
          activeId={activeConversation}
          onSelect={setActiveConversation}
        />

        {activeConversation ? (
          <ChatView
            conversationId={activeConversation}
            onClose={() => setActiveConversation(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a conversation from the left panel to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
