import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../api/messages';
import { Avatar } from '../components/common/Avatar';
import type { User } from '../types';

export function SettingsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((data: any) => setAgents(data)).catch(() => {});
  }, []);

  return (
    <>
      <Header title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
            <div className="flex items-center gap-4">
              <Avatar name={user?.name || ''} size="lg" />
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h2>
            <div className="space-y-3">
              {agents.map((agent: any) => (
                <div key={agent._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar name={agent.name} size="sm" online={agent.isOnline} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {agent.activeConversations || 0} active
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      agent.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {agent.role}
                    </span>
                  </div>
                </div>
              ))}
              {agents.length === 0 && (
                <p className="text-sm text-gray-400">No team members found</p>
              )}
            </div>
          </div>

          {/* WhatsApp API Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">WhatsApp API</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">API Status</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Webhook</span>
                <span className="text-gray-700">/api/webhook</span>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Configure your WhatsApp Cloud API credentials in the .env file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
