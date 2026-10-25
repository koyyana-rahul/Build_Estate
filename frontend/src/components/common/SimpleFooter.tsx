import React from 'react';

const SimpleFooter: React.FC = () => {
  return (
    <footer className="bg-[#f7f5f0] border-t border-[#e5e7eb] py-8">
      <div className="max-w-[1280px] mx-auto px-8 text-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 bg-[#142c4e] rounded-full" />
          <span className="font-manrope font-extralight text-sm text-[#253247] uppercase tracking-widest">
            Aavasa
          </span>
        </div>

        {/* Copyright */}
        <p className="font-manrope font-extralight text-xs text-[#687386]">
          © 2023 Aavasa. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SimpleFooter;