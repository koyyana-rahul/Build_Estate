import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import happyHomeowner1 from '../../images/Happy Homeowners_1.jpg';
import happyHomeowner2 from '../../images/Happy Homeowners_2.jpg';
import happyHomeowner3 from '../../images/Team section.jpg';
import rightFeatureCard from '../../images/Right side feature card.jpg';

const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const propertyImages = [
    happyHomeowner1,
    happyHomeowner2,
    happyHomeowner3,
    rightFeatureCard, 
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f5f0] pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
        {/* Background decorative blurs */}
        <motion.div
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: "easeInOut" as const
          }}
          className="absolute right-0 top-14 w-64 h-64 bg-[rgba(236,70,19,0.1)] rounded-full blur-[32px]"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            delay: 1,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: "easeInOut" as const
          }}
          className="absolute bottom-22 left-[55%] hidden h-64 w-64 rounded-full bg-[rgba(254,215,170,0.2)] blur-[32px] sm:block"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(20,44,78,0.2)] bg-[rgba(20,44,78,0.1)] px-3 py-2 sm:mb-8 sm:gap-3 sm:px-4">
                <div className="w-2 h-2 bg-[#142c4e] rounded-full" />
                <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.12em] text-[#142c4e] sm:text-xs sm:tracking-wider">
                  AI-Powered Real Estate
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 data-speakable variants={itemVariants} className="mb-5 max-w-[680px] font-fraunces text-[42px] leading-[1.08] text-[#253247] sm:text-[54px] sm:leading-[1.1] lg:mb-8 lg:text-[70px]">
                Discover Your<br />
                <span className="italic text-[#142c4e]">Dream Home</span> with<br />
                AI Intelligence
              </motion.h1>

              {/* Description */}
              <motion.p data-speakable variants={itemVariants} className="mb-8 max-w-[676px] font-manrope text-base font-light leading-6 text-[#253247] sm:text-lg sm:leading-7 lg:mb-10 lg:text-xl">
                Find flats, villas, and apartments in Mumbai, Delhi, Bangalore, Ahmedabad, and Pune.
                Aavasa uses AI-powered search and live market analysis to match you with the right property.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:mb-10">
                <Link to="/properties" className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl bg-[#142c4e] px-6 py-3.5 font-manrope text-base font-bold text-white shadow-[0px_10px_15px_-3px_rgba(20,44,78,0.25),0px_4px_6px_-4px_rgba(20,44,78,0.25)] transition-all hover:bg-[#0f2340] hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
                  Explore Properties
                  <span className="font-material-icons text-sm ml-2" aria-hidden="true">arrow_forward</span>
                </Link>
                <Link to="/ai-hub" className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl border-2 border-[#e5e7eb] px-6 py-3.5 font-manrope text-base font-bold text-[#253247] transition-all hover:border-[#142c4e] hover:text-[#142c4e] sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
                  <span className="font-material-icons text-2xl text-[#142c4e] mr-2" aria-hidden="true">smart_toy</span>
                  {import.meta.env.PROD ? 'AI Property Hub' : 'Try AI Search'}
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 sm:gap-4">
                <div className="flex -space-x-2">
                  <img src={propertyImages[0]} alt="" className="h-9 w-9 rounded-full border-2 border-[#f7f5f0] object-cover sm:h-10 sm:w-10" />
                  <img src={propertyImages[1]} alt="" className="h-9 w-9 rounded-full border-2 border-[#f7f5f0] object-cover sm:h-10 sm:w-10" />
                  <img src={propertyImages[2]} alt="" className="h-9 w-9 rounded-full border-2 border-[#f7f5f0] object-cover sm:h-10 sm:w-10" />
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f7f5f0] bg-[#253247] sm:h-10 sm:w-10">
                    <span className="font-manrope font-bold text-xs text-white">+2k</span>
                  </div>
                </div>
                <span className="max-w-[190px] font-manrope text-xs leading-5 text-[#687386] sm:max-w-none sm:text-sm">
                  Join 2,000+ happy homeowners
                </span>
              </motion.div>
            </motion.div>

            {/* Right - Featured Property Card */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-[0px_25px_50px_-12px_#e5e7eb]">
                <div className="relative h-[420px] sm:h-[540px] lg:h-[625px]">
                  <img
                    src={propertyImages[3]}
                    alt="Villa Serenity"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Property Info Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/20 bg-white/90 p-3 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-fraunces font-bold text-lg text-[#253247] mb-1">Villa Serenity</h3>
                        <p className="font-space-mono text-[10px] uppercase tracking-wide text-[#687386] sm:text-xs">Beverly Hills, CA</p>
                      </div>
                      <div className="shrink-0 rounded bg-[rgba(20,44,78,0.1)] px-2 py-1">
                        <span className="font-manrope text-[10px] font-bold text-[#142c4e] sm:text-xs">AI MATCH: 98%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-[#e5e7eb] pt-3">
                      <span className="whitespace-nowrap font-space-mono text-xs text-[#253247] sm:text-sm">$4,250,000</span>
                      <div className="flex items-center gap-3 text-[#253247] sm:gap-4">
                        <div className="flex items-center gap-1">
                          <span className="font-material-icons text-xs" aria-hidden="true">bed</span>
                          <span className="font-manrope text-xs sm:text-sm">4</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-material-icons text-xs" aria-hidden="true">shower</span>
                          <span className="font-manrope text-xs sm:text-sm">3.5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default HeroSection;
