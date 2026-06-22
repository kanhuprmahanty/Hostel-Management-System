import { create } from 'zustand';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  collection, getDocs, addDoc, setDoc, doc, updateDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const formatData = (snapshot) => snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

const seedDefaultData = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  if (!usersSnapshot.empty) return;

  const demoUsers = [
    { email: 'admin@hms.com', password: 'password', role: 'admin', name: 'Super Admin', phone: '1234567890' },
    { email: 'warden@hms.com', password: 'password', role: 'warden', name: 'John Warden', phone: '0987654321', hostelId: 'H1' },
    { email: 'student@hms.com', password: 'password', role: 'student', name: 'Alice Student', phone: '5551234567', roomRef: 'R101', rollNumber: 'CS2023' },
  ];

  const uids = {};
  for (const user of demoUsers) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      uids[user.role] = credential.user.uid;
      await signOut(auth);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        const credential = await signInWithEmailAndPassword(auth, user.email, user.password);
        uids[user.role] = credential.user.uid;
        await signOut(auth);
      } else {
        console.warn('Unable to seed auth user:', error.message);
      }
    }
  }

  const usersToCreate = demoUsers.map((item) => ({
    uid: uids[item.role] || `${item.role}-${Date.now()}`,
    name: item.name, email: item.email, role: item.role, phone: item.phone,
    hostelId: item.hostelId || '', roomRef: item.roomRef || '', rollNumber: item.rollNumber || '',
  }));

  await Promise.all(usersToCreate.map((u) => setDoc(doc(db, 'users', u.uid), u)));

  await setDoc(doc(db, 'hostels', 'H1'), {
    id: 'H1', name: 'Block A - Boys Hostel', type: 'male', totalRooms: 50,
    address: 'Main Campus, Block A', wardenId: uids.warden || '',
    facilities: ['WiFi', 'Laundry', 'Gym', 'Cafeteria'],
  });

  await setDoc(doc(db, 'rooms', 'R101'), { id: 'R101', roomNumber: '101', hostelId: 'H1', capacity: 2, occupancy: 1, status: 'available', floor: '1st Floor', type: 'double' });
  await setDoc(doc(db, 'rooms', 'R102'), { id: 'R102', roomNumber: '102', hostelId: 'H1', capacity: 2, occupancy: 2, status: 'full', floor: '1st Floor', type: 'double' });
  await setDoc(doc(db, 'rooms', 'R201'), { id: 'R201', roomNumber: '201', hostelId: 'H1', capacity: 1, occupancy: 0, status: 'available', floor: '2nd Floor', type: 'single' });

  await setDoc(doc(db, 'leaves', 'L1'), { id: 'L1', studentRef: uids.student || '', startDate: '2026-05-01', endDate: '2026-05-05', reason: 'Family function', status: 'pending', handledBy: '' });

  await setDoc(doc(db, 'complaints', 'C1'), { id: 'C1', studentRef: uids.student || '', type: 'plumbing', description: 'Leaking tap in bathroom', status: 'open', createdAt: new Date().toISOString().split('T')[0] });
  await setDoc(doc(db, 'complaints', 'C2'), { id: 'C2', studentRef: uids.student || '', type: 'electrical', description: 'Room light not working', status: 'in-progress', createdAt: new Date().toISOString().split('T')[0] });

  await setDoc(doc(db, 'notices', 'N1'), { id: 'N1', title: 'Welcome to HMS', content: 'Hostel rules have been updated. Please read the new guidelines carefully.', authorRef: uids.admin || '', targetAudience: 'all', createdAt: new Date().toISOString().split('T')[0] });
  await setDoc(doc(db, 'notices', 'N2'), { id: 'N2', title: 'Water Supply Maintenance', content: 'Water supply will be cut on Saturday 10am–2pm for maintenance work.', authorRef: uids.warden || '', targetAudience: 'student', createdAt: new Date().toISOString().split('T')[0] });

  await setDoc(doc(db, 'fees', 'F1'), { id: 'F1', studentRef: uids.student || '', amount: 5000, dueDate: '2026-05-15', status: 'pending', type: 'mess', description: 'Mess fee for May 2026' });
  await setDoc(doc(db, 'fees', 'F2'), { id: 'F2', studentRef: uids.student || '', amount: 8000, dueDate: '2026-04-30', status: 'paid', type: 'hostel', description: 'Hostel fee for April 2026', paidAt: new Date().toISOString().split('T')[0] });
};

const useAppStore = create((set, get) => ({
  users: [], rooms: [], leaves: [], complaints: [], notices: [], fees: [], attendance: [], hostels: [],
  isLoading: false, error: null,

  initializeAppData: async () => {
    set({ isLoading: true, error: null });
    try {
      await seedDefaultData();
      await Promise.all([
        get().loadUsers(), get().loadRooms(), get().loadLeaves(),
        get().loadComplaints(), get().loadNotices(), get().loadFees(),
        get().loadHostels(), get().loadAttendance(),
      ]);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message || 'Unable to initialize data', isLoading: false });
    }
  },

  loadUsers: async () => { const s = await getDocs(collection(db, 'users')); const users = formatData(s); set({ users }); return users; },
  loadRooms: async () => { const s = await getDocs(collection(db, 'rooms')); const rooms = formatData(s); set({ rooms }); return rooms; },
  loadLeaves: async () => { const s = await getDocs(collection(db, 'leaves')); const leaves = formatData(s); set({ leaves }); return leaves; },
  loadComplaints: async () => { const s = await getDocs(collection(db, 'complaints')); const complaints = formatData(s); set({ complaints }); return complaints; },
  loadNotices: async () => { const s = await getDocs(collection(db, 'notices')); const notices = formatData(s); set({ notices }); return notices; },
  loadFees: async () => { const s = await getDocs(collection(db, 'fees')); const fees = formatData(s); set({ fees }); return fees; },
  loadHostels: async () => { const s = await getDocs(collection(db, 'hostels')); const hostels = formatData(s); set({ hostels }); return hostels; },
  loadAttendance: async () => { const s = await getDocs(collection(db, 'attendance')); const attendance = formatData(s); set({ attendance }); return attendance; },

  // Users
  addUser: async (user) => {
    const created = await addDoc(collection(db, 'users'), { ...user, role: user.role || 'student', createdAt: serverTimestamp() });
    const newUser = { id: created.id, uid: created.id, ...user, role: user.role || 'student' };
    set((state) => ({ users: [...state.users, newUser] }));
    return newUser;
  },
  updateUser: async (uid, data) => {
    await updateDoc(doc(db, 'users', uid), data);
    set((state) => ({ users: state.users.map((u) => (u.uid === uid ? { ...u, ...data } : u)) }));
  },
  deleteUser: async (uid) => {
    await deleteDoc(doc(db, 'users', uid));
    set((state) => ({ users: state.users.filter((u) => u.uid !== uid) }));
  },

  // Hostels
  addHostel: async (hostel) => {
    const created = await addDoc(collection(db, 'hostels'), { ...hostel, createdAt: serverTimestamp() });
    const newHostel = { id: created.id, ...hostel };
    set((state) => ({ hostels: [...state.hostels, newHostel] }));
    return newHostel;
  },
  updateHostel: async (id, data) => {
    await updateDoc(doc(db, 'hostels', id), data);
    set((state) => ({ hostels: state.hostels.map((h) => (h.id === id ? { ...h, ...data } : h)) }));
  },
  deleteHostel: async (id) => {
    await deleteDoc(doc(db, 'hostels', id));
    set((state) => ({ hostels: state.hostels.filter((h) => h.id !== id) }));
  },

  // Rooms
  addRoom: async (room) => {
    const created = await addDoc(collection(db, 'rooms'), { ...room, occupancy: room.occupancy ?? 0, status: room.status ?? 'available', createdAt: serverTimestamp() });
    const newRoom = { id: created.id, ...room, occupancy: room.occupancy ?? 0, status: room.status ?? 'available' };
    set((state) => ({ rooms: [...state.rooms, newRoom] }));
    return newRoom;
  },
  updateRoom: async (id, data) => {
    await updateDoc(doc(db, 'rooms', id), data);
    set((state) => ({ rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...data } : r)) }));
  },
  deleteRoom: async (id) => {
    await deleteDoc(doc(db, 'rooms', id));
    set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) }));
  },

  // Leaves
  addLeave: async (leave) => {
    const created = await addDoc(collection(db, 'leaves'), { ...leave, status: 'pending', createdAt: serverTimestamp() });
    const newLeave = { id: created.id, ...leave, status: 'pending' };
    set((state) => ({ leaves: [...state.leaves, newLeave] }));
    return newLeave;
  },
  updateLeaveStatus: async (id, status, wardenId) => {
    await updateDoc(doc(db, 'leaves', id), { status, handledBy: wardenId });
    set((state) => ({ leaves: state.leaves.map((l) => (l.id === id ? { ...l, status, handledBy: wardenId } : l)) }));
  },

  // Complaints
  addComplaint: async (complaint) => {
    const created = await addDoc(collection(db, 'complaints'), { ...complaint, status: 'open', createdAt: serverTimestamp() });
    const newComplaint = { id: created.id, ...complaint, status: 'open' };
    set((state) => ({ complaints: [...state.complaints, newComplaint] }));
    return newComplaint;
  },
  updateComplaintStatus: async (id, status) => {
    const resolvedAt = status === 'resolved' ? new Date().toISOString().split('T')[0] : null;
    await updateDoc(doc(db, 'complaints', id), { status, resolvedAt });
    set((state) => ({ complaints: state.complaints.map((c) => (c.id === id ? { ...c, status, resolvedAt } : c)) }));
  },

  // Notices
  addNotice: async (notice) => {
    const created = await addDoc(collection(db, 'notices'), { ...notice, createdAt: serverTimestamp() });
    const newNotice = { id: created.id, ...notice, createdAt: new Date().toISOString().split('T')[0] };
    set((state) => ({ notices: [...state.notices, newNotice] }));
    return newNotice;
  },
  deleteNotice: async (id) => {
    await deleteDoc(doc(db, 'notices', id));
    set((state) => ({ notices: state.notices.filter((n) => n.id !== id) }));
  },

  // Fees
  addFee: async (fee) => {
    const created = await addDoc(collection(db, 'fees'), { ...fee, status: 'pending', createdAt: serverTimestamp() });
    const newFee = { id: created.id, ...fee, status: 'pending' };
    set((state) => ({ fees: [...state.fees, newFee] }));
    return newFee;
  },
  payFee: async (id) => {
    await updateDoc(doc(db, 'fees', id), { status: 'paid', paidAt: new Date().toISOString().split('T')[0] });
    set((state) => ({ fees: state.fees.map((f) => (f.id === id ? { ...f, status: 'paid', paidAt: new Date().toISOString().split('T')[0] } : f)) }));
  },
  deleteFee: async (id) => {
    await deleteDoc(doc(db, 'fees', id));
    set((state) => ({ fees: state.fees.filter((f) => f.id !== id) }));
  },

  // Attendance
  markAttendance: async (records, date) => {
    const created = await addDoc(collection(db, 'attendance'), { records, date, createdAt: serverTimestamp() });
    const entry = { id: created.id, records, date };
    set((state) => ({ attendance: [...state.attendance, entry] }));
    return created.id;
  },
}));

export default useAppStore;
