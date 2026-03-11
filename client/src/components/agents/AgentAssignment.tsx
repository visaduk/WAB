import { useState, useEffect } from 'react';
import { assignConversation } from '../../api/conversations';
import { getUsers } from '../../api/messages';
import type { User } from '../../types';

interface Props {
  conversationId: string;
  currentAgent?: User | null;
}

export function AgentAssignment({ conversationId, currentAgent }: Props) {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers().then(setAgents).catch(() => {});
  }, []);

  const handleAssign = async (agentId: string) => {
    setLoading(true);
    try {
      await assignConversation(conversationId, agentId || null);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={(currentAgent as any)?._id || (currentAgent as any)?.id || ''}
      onChange={(e) => handleAssign(e.target.value)}
      disabled={loading}
      className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">Unassigned</option>
      {agents.map((agent: any) => (
        <option key={agent._id} value={agent._id}>
          {agent.name}
        </option>
      ))}
    </select>
  );
}
