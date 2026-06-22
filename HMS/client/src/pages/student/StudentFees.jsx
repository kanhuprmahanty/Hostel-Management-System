import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';
import { CreditCard, DollarSign, CheckCircle, Clock } from 'lucide-react';

const StudentFees = () => {
  const { user } = useAuthStore();
  const { fees } = useAppStore();

  const myFees = fees.filter(f => f.studentRef === user.uid);
  const totalPaid = myFees.filter(f => f.status === 'paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalPending = myFees.filter(f => f.status === 'pending').reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Fees</h2>
        <p className="mt-1 text-sm text-gray-500">View your fee statements and pending dues.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border-l-4 border-orange-500">
          <div className="p-4 rounded-full bg-orange-50 text-orange-600 mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Dues</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalPending.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border-l-4 border-green-500">
          <div className="p-4 rounded-full bg-green-50 text-green-600 mr-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalPaid.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" /> Fee Statements
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {myFees.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No fee records found.</li>
          ) : myFees.map(fee => (
            <li key={fee.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${fee.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-sm font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">{fee.type}</span>
                      <h4 className="text-lg font-semibold text-gray-900">₹{Number(fee.amount).toLocaleString()}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{fee.description}</p>
                    <div className="text-xs text-gray-500 flex gap-4 mt-2">
                      <span>Due: <span className="font-medium">{fee.dueDate}</span></span>
                      {fee.paidAt && <span>Paid on: <span className="font-medium text-green-600">{fee.paidAt}</span></span>}
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold capitalize
                    ${fee.status === 'paid' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>
                    {fee.status === 'paid' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {fee.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentFees;
