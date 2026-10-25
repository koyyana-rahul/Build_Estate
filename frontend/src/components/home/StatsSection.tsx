import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    { value: '2,450+', label: 'Properties Sold' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '150+', label: 'Cities Covered' },
    { value: '$1.2B', label: 'Market Value' },
  ];

  return (
    <section className="border-y border-[rgba(20,44,78,0.05)] bg-[#f7f5f0] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-[rgba(20,44,78,0.1)] lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex min-h-[106px] flex-col items-center justify-center bg-[#f7f5f0] px-2 py-5 text-center sm:min-h-[120px] sm:px-4">
              <div className="mb-1 whitespace-nowrap font-space-mono text-2xl font-bold leading-tight text-[#142c4e] sm:mb-2 sm:text-3xl lg:text-4xl">
                {value}
              </div>
              <div className="max-w-[130px] text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-[#687386] sm:max-w-none sm:text-xs sm:tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
