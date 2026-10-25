import React from 'react';
import mapLocationImage from '../../images/Map_Location.jpg';

const ContactMapSection: React.FC = () => {
  return (
    <section className="bg-[#f7f5f0] py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="relative aspect-[1280/400] rounded-2xl overflow-hidden border border-[#e5e7eb] bg-gray-100">
          {/* Map Image */}
          <img
            src={mapLocationImage}
            alt="Office location map"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          
          {/* Map Overlay Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="mx-4 max-w-[calc(100%-2rem)] bg-white shadow-2xl rounded-xl px-4 sm:px-8 py-4 flex items-center gap-3 hover:shadow-3xl transition-shadow group">
              <span className="material-icons text-2xl text-[#142c4e] group-hover:scale-110 transition-transform">
                location_on
              </span>
              <div className="text-left">
                <p className="font-syne font-bold text-base text-[#253247] mb-0.5">
                  Aavasa Office
                </p>
                <p className="font-manrope font-extralight text-xs text-[#687386]">
                  Click to view on Google Maps
                </p>
              </div>
              <span className="material-icons text-[#142c4e]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;