import React from 'react';

const ContactInfoCards: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Visit Our Office Card */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(20,44,78,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#142c4e]">
              location_on
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-syne font-bold text-lg text-[#253247] mb-2">
              Visit Our Office
            </h3>
            <p className="font-manrope font-extralight text-sm text-[#253247] leading-relaxed mb-3">
              502, Devpath Building,<br />
              Near Torrent Lab,<br />
              Ashram Road, Ahmedabad
            </p>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=502%20Devpath%20Building%20Ashram%20Road%20Ahmedabad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-manrope font-medium text-sm text-[#142c4e] hover:text-[#142c4e] transition-[color]"
            >
              <span>Get Directions</span>
              <span className="material-icons text-sm">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Call or Email Us Card */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(20,44,78,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#142c4e]">
              phone
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-syne font-bold text-lg text-[#253247] mb-3">
              Call or Email Us
            </h3>
            <div className="space-y-2">
              <a 
                href="tel:+919876543210" 
                className="flex items-center gap-2 font-manrope font-extralight text-sm text-[#253247] hover:text-[#142c4e] transition-[color]"
              >
                <span className="material-icons text-base">
                  call
                </span>
                <span>+91 98765 43210</span>
              </a>
              <a 
                href="mailto:koyyanarahul4002@gmail.com" 
                className="flex items-center gap-2 font-manrope font-extralight text-sm text-[#253247] hover:text-[#142c4e] transition-[color]"
              >
                <span className="material-icons text-base">
                  email
                </span>
                <span>hello@buildestate.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours Card */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(20,44,78,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#142c4e]">
              schedule
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-syne font-bold text-lg text-[#253247] mb-3">
              Business Hours
            </h3>
            <div className="space-y-2 font-manrope font-extralight text-sm text-[#253247]">
              <div className="flex justify-between items-center">
                <span>Mon - Fri:</span>
                <span className="font-medium text-[#253247]">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Saturday:</span>
                <span className="font-medium text-[#253247]">10:00 - 16:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sunday:</span>
                <span className="font-medium text-[#253247]">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCards;