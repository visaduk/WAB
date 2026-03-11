import type { User } from '../../types';

interface Props {
  agent: User;
}

export function AgentBadge({ agent }: Props) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
      <span className={`w-1.5 h-1.5 rounded-full ${agent.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
      {agent.name}
    </span>
  );
}
