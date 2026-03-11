import { Search } from 'lucide-react';

interface Props {
  status: string;
  onStatusChange: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  assignedFilter: string;
  onAssignedFilterChange: (filter: string) => void;
}

export function ConversationFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
  assignedFilter,
  onAssignedFilterChange,
}: Props) {
  const statuses = [
    { value: '', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'closed', label: 'Closed' },
  ];

  const assignedOptions = [
    { value: '', label: 'Everyone' },
    { value: 'mine', label: 'Mine' },
    { value: 'unassigned', label: 'Unassigned' },
  ];

  return (
    <div className="p-3 border-b border-gray-200 space-y-2">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Status tabs */}
      <div className="flex gap-1">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              status === s.value
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Assignment filter */}
      <div className="flex gap-1">
        {assignedOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => onAssignedFilterChange(o.value)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              assignedFilter === o.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
