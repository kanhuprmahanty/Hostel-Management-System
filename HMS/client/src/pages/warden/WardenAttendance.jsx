import { useState, useEffect } from 'react';
import useAppStore from '../../store/appStore';
import useAuthStore from '../../store/authStore';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const WardenAttendance = () => {
  const { user } = useAuthStore();
  const { users, markAttendance, attendance } = useAppStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(false);

  const blockStudents = users.filter(u => u.role === 'student' && (user.hostelId ? u.hostelId === user.hostelId : true));
  
  useEffect(() => {
    const existing = attendance.find(a => a.date === date);
    if (existing) {
      setRecords(existing.records);
    } else {
      const initial = {};
      blockStudents.forEach(s => initial[s.uid] = 'present');
      setRecords(initial);
    }
  }, [date, attendance, users]);

  const handleToggle = (uid, status) => {
    setRecords(prev => ({ ...prev, [uid]: status }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await markAttendance(records, date);
      alert('Attendance saved successfully');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Tracking</h2>
          <p className="text-sm text-gray-500 mt-1">Mark daily attendance for students in your block.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-sm border-none focus:ring-0" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {blockStudents.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No students found in your block.</p>
          </div>
        ) : (
          <div>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <span className="text-sm font-medium text-gray-600">Total Students: {blockStudents.length}</span>
              <div className="flex gap-4 text-sm font-medium">
                <span className="text-green-600">Present: {Object.values(records).filter(s => s === 'present').length}</span>
                <span className="text-red-600">Absent: {Object.values(records).filter(s => s === 'absent').length}</span>
              </div>
            </div>
            <ul className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
              {blockStudents.map(student => (
                <li key={student.uid} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">Room: {student.roomRef || 'Not Assigned'}</p>
                    </div>
                  </div>
                  <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                    <button 
                      onClick={() => handleToggle(student.uid, 'present')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${records[student.uid] === 'present' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <CheckCircle className="w-4 h-4" /> Present
                    </button>
                    <button 
                      onClick={() => handleToggle(student.uid, 'absent')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${records[student.uid] === 'absent' ? 'bg-red-100 text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <XCircle className="w-4 h-4" /> Absent
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={handleSave} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60">
                {loading ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardenAttendance;
