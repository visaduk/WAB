import { useState } from 'react';
import { useConversations } from '../../hooks/useConversations';
import { useAuth } from '../../context/AuthContext';
import { ConversationItem } from './ConversationItem';
import { ConversationFilters } from './ConversationFilters';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Props {
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ activeId, onSelect }: Props) {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');

  const filters: any = {};
  if (status) filters.status = status;
  if (search) filters.search = search;
  if (assignedFilter === 'mine' && user) filters.assignedTo = user.id;
  if (assignedFilter === 'unassigned') filters.assignedTo = 'unassigned';

  const { data, isLoading } = useConversations(filters);

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Conversations</h2>
        {data && <span className="text-xs text-gray-400">{data.total} total</span>}
      </div>

      <ConversationFilters
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearchChange={setSearch}
        assignedFilter={assignedFilter}
        onAssignedFilterChange={setAssignedFilter}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : data?.conversations.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No conversations</p>
        ) : (
          data?.conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              isActive={conv._id === activeId}
              onClick={() => onSelect(conv._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
