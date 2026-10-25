import React from 'react';

const ContactHeroSection: React.FC = () => {
  return (
    <section className="bg-[#f7f5f0] border-b border-[rgba(230,224,218,0.5)] py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="text-center">
          {/* Label */}
          <div className="flex justify-center mb-4">
            <span className="font-space-mono text-xs text-[#142c4e] uppercase tracking-widest">
              Contact & Support
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-fraunces text-6xl text-[#253247] mb-6">
            We'd Love to Hear From You
          </h1>

          {/* Subtitle */}
          <p className="font-manrope text-lg text-[#253247] leading-relaxed max-w-[672px] mx-auto">
            Whether you have a question about listings, need assistance with our AI tools, or
            want to explore partnership opportunities, our team is ready to help.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;