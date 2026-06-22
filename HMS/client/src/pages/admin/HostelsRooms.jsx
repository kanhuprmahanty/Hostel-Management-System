import { useState } from 'react';
import useAppStore from '../../store/appStore';
import { Plus, Edit2, Trash2, Home, Bed, Users, ChevronDown, ChevronUp, X } from 'lucide-react';

const ROOM_TYPES = ['single', 'double', 'triple'];
const HOSTEL_TYPES = ['male', 'female', 'co-ed'];

const Badge = ({ status }) => {
  const map = { available: 'bg-green-100 text-green-800', full: 'bg-red-100 text-red-800', maintenance: 'bg-yellow-100 text-yellow-800' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const HostelsRooms = () => {
  const { hostels, rooms, users, addHostel, updateHostel, deleteHostel, addRoom, updateRoom, deleteRoom } = useAppStore();
  const [activeTab, setActiveTab] = useState('hostels');
  const [expandedHostel, setExpandedHostel] = useState(null);
  const [hostelModal, setHostelModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const [hostelForm, setHostelForm] = useState({ name: '', type: 'male', totalRooms: '', address: '', wardenId: '' });
  const [roomForm, setRoomForm] = useState({ roomNumber: '', hostelId: '', floor: '', type: 'double', capacity: 2, occupancy: 0, status: 'available' });

  const wardens = users.filter((u) => u.role === 'warden');

  const openHostelModal = (hostel = null) => {
    setEditingHostel(hostel);
    setHostelForm(hostel ? { name: hostel.name, type: hostel.type, totalRooms: hostel.totalRooms, address: hostel.address || '', wardenId: hostel.wardenId || '' } : { name: '', type: 'male', totalRooms: '', address: '', wardenId: '' });
    setHostelModal(true);
  };

  const openRoomModal = (room = null, hostelId = '') => {
    setEditingRoom(room);
    setRoomForm(room ? { roomNumber: room.roomNumber, hostelId: room.hostelId, floor: room.floor || '', type: room.type || 'double', capacity: room.capacity, occupancy: room.occupancy, status: room.status } : { roomNumber: '', hostelId, floor: '', type: 'double', capacity: 2, occupancy: 0, status: 'available' });
    setRoomModal(true);
  };

  const handleHostelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingHostel) await updateHostel(editingHostel.id, { ...hostelForm, totalRooms: Number(hostelForm.totalRooms) });
      else await addHostel({ ...hostelForm, totalRooms: Number(hostelForm.totalRooms) });
      setHostelModal(false);
    } finally { setLoading(false); }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...roomForm, capacity: Number(roomForm.capacity), occupancy: Number(roomForm.occupancy) };
      if (editingRoom) await updateRoom(editingRoom.id, data);
      else await addRoom(data);
      setRoomModal(false);
    } finally { setLoading(false); }
  };

  const handleDeleteHostel = async (id) => { if (window.confirm('Delete this hostel?')) await deleteHostel(id); };
  const handleDeleteRoom = async (id) => { if (window.confirm('Delete this room?')) await deleteRoom(id); };

  const getHostelRooms = (hostelId) => rooms.filter((r) => r.hostelId === hostelId);
  const getWardenName = (id) => wardens.find((w) => w.uid === id)?.name || 'Unassigned';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hostels & Rooms</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hostel blocks and room allocations.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'hostels' && (
            <button onClick={() => openHostelModal()} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Hostel
            </button>
          )}
          {activeTab === 'rooms' && (
            <button onClick={() => openRoomModal()} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Room
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {['hostels', 'rooms'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Hostels Tab */}
      {activeTab === 'hostels' && (
        <div className="space-y-4">
          {hostels.length === 0 && <p className="text-center text-gray-400 py-12">No hostels found. Add one to get started.</p>}
          {hostels.map((hostel) => {
            const hostelRooms = getHostelRooms(hostel.id);
            const isExpanded = expandedHostel === hostel.id;
            return (
              <div key={hostel.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{hostel.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{hostel.type} · {hostel.totalRooms} rooms · Warden: {getWardenName(hostel.wardenId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{hostelRooms.length} rooms added</span>
                    <button onClick={() => openRoomModal(null, hostel.id)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg text-xs font-medium">+ Room</button>
                    <button onClick={() => openHostelModal(hostel)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteHostel(hostel.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    <button onClick={() => setExpandedHostel(isExpanded ? null : hostel.id)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {hostelRooms.length === 0 ? (
                      <p className="text-center text-gray-400 py-6 text-sm">No rooms in this hostel yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50">
                            <tr>
                              {['Room No.', 'Floor', 'Type', 'Capacity', 'Occupancy', 'Status', 'Actions'].map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {hostelRooms.map((room) => (
                              <tr key={room.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{room.roomNumber}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{room.floor || '—'}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 capitalize">{room.type || '—'}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{room.capacity}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{room.occupancy}/{room.capacity}</td>
                                <td className="px-4 py-3"><Badge status={room.status} /></td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    <button onClick={() => openRoomModal(room)} className="text-indigo-600 hover:text-indigo-800"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteRoom(room.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {rooms.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No rooms found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Room No.', 'Hostel', 'Floor', 'Type', 'Capacity', 'Occupancy', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rooms.map((room) => {
                    const hostel = hostels.find((h) => h.id === room.hostelId);
                    return (
                      <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-semibold text-gray-900">{room.roomNumber}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{hostel?.name || room.hostelId}</td>
                        <td className="px-5 py-3 text-sm text-gray-500">{room.floor || '—'}</td>
                        <td className="px-5 py-3 text-sm text-gray-500 capitalize">{room.type || '—'}</td>
                        <td className="px-5 py-3 text-sm text-gray-700">{room.capacity}</td>
                        <td className="px-5 py-3 text-sm text-gray-700">{room.occupancy}/{room.capacity}</td>
                        <td className="px-5 py-3"><Badge status={room.status} /></td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openRoomModal(room)} className="text-indigo-600 hover:text-indigo-800"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteRoom(room.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Hostel Modal */}
      {hostelModal && (
        <Modal title={editingHostel ? 'Edit Hostel' : 'Add New Hostel'} onClose={() => setHostelModal(false)}>
          <form onSubmit={handleHostelSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
              <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={hostelForm.name} onChange={(e) => setHostelForm({ ...hostelForm, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={hostelForm.type} onChange={(e) => setHostelForm({ ...hostelForm, type: e.target.value })}>
                  {HOSTEL_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
                <input type="number" min="1" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={hostelForm.totalRooms} onChange={(e) => setHostelForm({ ...hostelForm, totalRooms: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={hostelForm.address} onChange={(e) => setHostelForm({ ...hostelForm, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Warden</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={hostelForm.wardenId} onChange={(e) => setHostelForm({ ...hostelForm, wardenId: e.target.value })}>
                <option value="">-- None --</option>
                {wardens.map((w) => <option key={w.uid} value={w.uid}>{w.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setHostelModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60">{loading ? 'Saving...' : 'Save Hostel'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Room Modal */}
      {roomModal && (
        <Modal title={editingRoom ? 'Edit Room' : 'Add New Room'} onClose={() => setRoomModal(false)}>
          <form onSubmit={handleRoomSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={roomForm.roomNumber} onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={roomForm.floor} onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
              <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={roomForm.hostelId} onChange={(e) => setRoomForm({ ...roomForm, hostelId: e.target.value })}>
                <option value="">-- Select Hostel --</option>
                {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}>
                  {ROOM_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input type="number" min="1" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupancy</label>
                <input type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={roomForm.occupancy} onChange={(e) => setRoomForm({ ...roomForm, occupancy: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={roomForm.status} onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}>
                <option value="available">Available</option>
                <option value="full">Full</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setRoomModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60">{loading ? 'Saving...' : 'Save Room'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HostelsRooms;
