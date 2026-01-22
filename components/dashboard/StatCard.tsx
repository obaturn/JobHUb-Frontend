import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  onNavigate?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, onNavigate }) => {
  const CardContent = (
    <>
      <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-3xl font-bold text-neutral-dark">{value}</p>
        <p className="text-gray-500">{label}</p>
      </div>
    </>
  );

  if (onNavigate) {
    return (
      <button onClick={onNavigate} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 w-full text-left hover:shadow-lg hover:border-primary border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1">
        {CardContent}
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        {CardContent}
    </div>
  );
};

export default StatCard;
