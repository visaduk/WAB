import { useSocket } from '../../context/SocketContext';

export function Header({ title }: { title: string }) {
  const { connected } = useSocket();

  return (
    <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-2 text-sm">
        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-gray-500">{connected ? 'Connected' : 'Disconnected'}</span>
      </div>
    </header>
  );
}
