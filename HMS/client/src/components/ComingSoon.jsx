import { Construction } from 'lucide-react';

const ComingSoon = ({ title }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-primary-50 p-6 rounded-full mb-6">
        <Construction className="w-16 h-16 text-primary-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md">
        This feature is currently under development. We are working hard to bring it to you soon.
      </p>
    </div>
  );
};

export default ComingSoon;
