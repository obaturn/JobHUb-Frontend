import React from 'react';

interface AdminStatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center gap-4 border border-gray-100">
      <div className="bg-neutral-light p-4 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-dark">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
};

export default AdminStatCard;
