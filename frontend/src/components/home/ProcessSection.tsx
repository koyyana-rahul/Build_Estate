import React from 'react';

const ProcessSection: React.FC = () => {
  return (
    <section className="bg-[#f7f5f0] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left - Sticky Content */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="font-space-mono text-sm text-[#142c4e] uppercase tracking-widest mb-6">Process</div>
              <h2 className="font-fraunces text-5xl text-[#253247] mb-6 leading-tight">
                The Path to Your<br />
                <span className="italic text-[#142c4e]">New Beginning</span>
              </h2>
              <p className="font-manrope font-light text-lg text-[#253247] mb-8 leading-relaxed">
                We've simplified the complex journey of buying a home into four seamless, AI-
                assisted steps.
              </p>
              <button className="bg-[#253247] text-white font-manrope font-medium px-8 py-3 rounded-lg shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] hover:bg-[#253247] transition-all">
                Start Your Journey
              </button>
            </div>
          </div>

          {/* Right - Process Steps */}
          <div className="lg:col-span-8 space-y-12">
            {/* Step 1 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#e5e7eb] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#687386]">01</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#253247] mb-3">Profile Analysis</h3>
                  <p className="font-manrope text-base text-[#253247] leading-relaxed">
                    Our AI deep-dives into your preferences, lifestyle needs, and financial goals to build a comprehensive
                    buyer profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#e5e7eb] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#687386]">02</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#253247] mb-3">Smart Matching</h3>
                  <p className="font-manrope text-base text-[#253247] leading-relaxed">
                    Algorithms scan thousands of listings to find properties that align with your unique criteria, filtering out
                    the noise.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#e5e7eb] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#687386]">03</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#253247] mb-3">Virtual Tours & Insights</h3>
                  <p className="font-manrope text-base text-[#253247] leading-relaxed">
                    Experience homes remotely with immersive 3D tours and receive detailed neighborhood analytics
                    reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#e5e7eb] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#687386]">04</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#253247] mb-3">Seamless Closing</h3>
                  <p className="font-manrope text-base text-[#253247] leading-relaxed">
                    From offer to keys, our digital platform handles paperwork, negotiations, and closing logistics
                    effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
