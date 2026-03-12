import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getConversations } from '@/api/conversations';
import type { Conversation } from '@/types';

export const CONVERSATIONS_KEY = ['conversations'] as const;

export function useConversations(params?: {
  status?: string;
  search?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: [...CONVERSATIONS_KEY, params],
    queryFn: () => getConversations(params),
  });
}

/**
 * Helpers to imperatively update the conversations cache
 * (used by socket event handlers).
 */
export function useConversationUpdaters() {
  const qc = useQueryClient();

  const updateConversationInCache = (updated: Conversation) => {
    qc.setQueriesData<{ conversations: Conversation[]; total: number }>(
      { queryKey: CONVERSATIONS_KEY },
      (old) => {
        if (!old) return old;
        const idx = old.conversations.findIndex((c) => c._id === updated._id);
        if (idx === -1) {
          // New conversation — prepend it
          return { ...old, conversations: [updated, ...old.conversations], total: old.total + 1 };
        }
        const next = [...old.conversations];
        next[idx] = updated;
        return { ...old, conversations: next };
      },
    );
  };

  const invalidateConversations = () => {
    qc.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
  };

  return { updateConversationInCache, invalidateConversations };
}
