import { useState, useRef, FormEvent } from 'react';
import { Send, Paperclip, MapPin, ListOrdered, MousePointerClick } from 'lucide-react';
import { sendMessage, uploadMedia } from '../../api/messages';

interface Props {
  conversationId: string;
  isWithinWindow: boolean;
  onMessageSent: () => void;
}

type InputMode = 'text' | 'buttons' | 'list' | 'location';

export function MessageInput({ conversationId, isWithinWindow, onMessageSent }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<InputMode>('text');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Button mode state
  const [buttons, setButtons] = useState([{ id: 'btn_1', title: '' }]);
  const [headerText, setHeaderText] = useState('');

  // List mode state
  const [listButtonText, setListButtonText] = useState('Choose');
  const [sections, setSections] = useState([
    { title: 'Section 1', rows: [{ id: 'row_1', title: '', description: '' }] },
  ]);

  // Location mode state
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');

  const handleSendText = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendMessage({ conversationId, type: 'text', text: text.trim() });
      setText('');
      onMessageSent();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendButtons = async () => {
    if (!text.trim() || buttons.some((b) => !b.title.trim())) return;
    setSending(true);
    try {
      await sendMessage({
        conversationId,
        type: 'buttons',
        text: text.trim(),
        buttons: buttons.map((b) => ({ id: b.id, title: b.title.trim() })),
        headerText: headerText || undefined,
      });
      setText('');
      setButtons([{ id: 'btn_1', title: '' }]);
      setHeaderText('');
      setMode('text');
      onMessageSent();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendList = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendMessage({
        conversationId,
        type: 'list',
        text: text.trim(),
        listButtonText,
        sections: sections.map((s) => ({
          title: s.title,
          rows: s.rows.filter((r) => r.title.trim()).map((r) => ({
            id: r.id,
            title: r.title.trim(),
            description: r.description || undefined,
          })),
        })),
        headerText: headerText || undefined,
      });
      setText('');
      setSections([{ title: 'Section 1', rows: [{ id: 'row_1', title: '', description: '' }] }]);
      setListButtonText('Choose');
      setMode('text');
      onMessageSent();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendLocation = async () => {
    if (!latitude || !longitude) return;
    setSending(true);
    try {
      await sendMessage({
        conversationId,
        type: 'location',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        locationName: locationName || undefined,
        locationAddress: locationAddress || undefined,
      });
      setLatitude('');
      setLongitude('');
      setLocationName('');
      setLocationAddress('');
      setMode('text');
      onMessageSent();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSending(true);
    setShowAttachMenu(false);
    try {
      const { mediaId, mimeType } = await uploadMedia(file);
      const type = mimeType.startsWith('image/') ? 'image' :
                   mimeType.startsWith('video/') ? 'video' :
                   mimeType.startsWith('audio/') ? 'audio' : 'document';
      await sendMessage({
        conversationId,
        type,
        mediaId,
        filename: file.name,
        mimeType,
      });
      onMessageSent();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'text') handleSendText();
    if (mode === 'buttons') handleSendButtons();
    if (mode === 'list') handleSendList();
    if (mode === 'location') handleSendLocation();
  };

  if (!isWithinWindow) {
    return (
      <div className="border-t border-gray-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        24-hour window expired. You can only send template messages.
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Mode selector */}
      <div className="flex gap-1 px-3 pt-2">
        {([
          { key: 'text', icon: null, label: 'Text' },
          { key: 'buttons', icon: MousePointerClick, label: 'Buttons' },
          { key: 'list', icon: ListOrdered, label: 'List' },
          { key: 'location', icon: MapPin, label: 'Location' },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === key ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3">
        {mode === 'text' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Paperclip size={20} />
              </button>
              {showAttachMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    Upload File
                  </button>
                </div>
              )}
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="p-2 bg-green-600 text-white rounded-full disabled:opacity-50 hover:bg-green-700 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        )}

        {mode === 'buttons' && (
          <div className="space-y-2">
            <input
              type="text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="Header (optional)"
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message body..."
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={2}
            />
            <div className="space-y-1">
              {buttons.map((btn, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={btn.title}
                    onChange={(e) => {
                      const updated = [...buttons];
                      updated[i] = { ...btn, title: e.target.value };
                      setButtons(updated);
                    }}
                    placeholder={`Button ${i + 1} (max 20 chars)`}
                    maxLength={20}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {buttons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setButtons(buttons.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {buttons.length < 3 && (
                <button
                  type="button"
                  onClick={() =>
                    setButtons([...buttons, { id: `btn_${buttons.length + 1}`, title: '' }])
                  }
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  + Add Button
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!text.trim() || buttons.some((b) => !b.title.trim()) || sending}
              className="w-full py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50 hover:bg-green-700"
            >
              Send Buttons
            </button>
          </div>
        )}

        {mode === 'list' && (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message body..."
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={2}
            />
            <input
              type="text"
              value={listButtonText}
              onChange={(e) => setListButtonText(e.target.value)}
              placeholder="Button text (e.g., 'Choose')"
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {sections.map((section, si) => (
              <div key={si} className="border border-gray-200 rounded p-2 space-y-1">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[si] = { ...section, title: e.target.value };
                    setSections(updated);
                  }}
                  placeholder="Section title"
                  className="w-full px-2 py-1 border-b border-gray-100 text-sm font-medium focus:outline-none"
                />
                {section.rows.map((row, ri) => (
                  <div key={ri} className="flex gap-1">
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[si].rows[ri] = { ...row, title: e.target.value };
                        setSections(updated);
                      }}
                      placeholder="Row title"
                      className="flex-1 px-2 py-1 border border-gray-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[si].rows[ri] = { ...row, description: e.target.value };
                        setSections(updated);
                      }}
                      placeholder="Description"
                      className="flex-1 px-2 py-1 border border-gray-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...sections];
                    updated[si].rows.push({
                      id: `row_${Date.now()}`,
                      title: '',
                      description: '',
                    });
                    setSections(updated);
                  }}
                  className="text-xs text-green-600"
                >
                  + Add Row
                </button>
              </div>
            ))}
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="w-full py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50 hover:bg-green-700"
            >
              Send List
            </button>
          </div>
        )}

        {mode === 'location' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude"
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude"
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Location name (optional)"
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="Address (optional)"
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={!latitude || !longitude || sending}
              className="w-full py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50 hover:bg-green-700"
            >
              Send Location
            </button>
          </div>
        )}
      </form>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
      />
    </div>
  );
}
