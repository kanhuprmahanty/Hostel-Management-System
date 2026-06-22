import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';
import { Home, User, Users, MapPin, Hash } from 'lucide-react';

const StudentRoom = () => {
  const { user } = useAuthStore();
  const { rooms, hostels, users } = useAppStore();

  const myRoom = rooms.find(r => r.id === user.roomRef);
  const myHostel = hostels.find(h => h.id === myRoom?.hostelId);
  const roommates = users.filter(u => u.roomRef === myRoom?.id && u.uid !== user.uid);
  const warden = users.find(u => u.uid === myHostel?.wardenId);

  if (!myRoom) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Room Assigned</h3>
        <p className="text-gray-500">You have not been assigned to any room yet. Please contact your warden or administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Room Details</h2>
        <p className="mt-1 text-sm text-gray-500">Information about your hostel block and room.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-8 flex items-center">
              <div className="bg-white/20 p-4 rounded-2xl mr-4 backdrop-blur-sm">
                <Home className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h3 className="text-3xl font-bold">Room {myRoom.roomNumber}</h3>
                <p className="text-primary-100 mt-1">{myHostel?.name}</p>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                <Hash className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Room Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{myRoom.type} Room</p>
                  <p className="text-xs text-gray-400 mt-0.5">{myRoom.occupancy} of {myRoom.capacity} occupied</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                <MapPin className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">{myRoom.floor || 'N/A'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{myHostel?.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Roommates */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" /> Roommates
            </h3>
            {roommates.length === 0 ? (
              <p className="text-gray-500 text-sm">You currently have no roommates.</p>
            ) : (
              <ul className="space-y-4">
                {roommates.map(mate => (
                  <li key={mate.uid} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                      {mate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mate.name}</p>
                      <p className="text-sm text-gray-500">{mate.rollNumber || mate.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Warden & Hostel Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-indigo-500">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Warden Details</h3>
            {warden ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl">
                    {warden.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{warden.name}</p>
                    <p className="text-sm text-gray-500">Block Warden</p>
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <p className="text-sm flex items-center gap-2 text-gray-600"><User className="w-4 h-4 text-gray-400" /> {warden.email}</p>
                  {warden.phone && <p className="text-sm flex items-center gap-2 text-gray-600"><User className="w-4 h-4 text-gray-400" /> {warden.phone}</p>}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No warden assigned to this block.</p>
            )}
          </div>

          {myHostel?.facilities && myHostel.facilities.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Block Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {myHostel.facilities.map((fac, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRoom;
