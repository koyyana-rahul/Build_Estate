import React from 'react';
import { MapPin } from 'lucide-react';

interface PropertyHeaderProps {
  status?: 'available' | 'sold' | 'pending';
  refNumber?: string;
  name?: string;
  location?: string;
  price?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

const statusDot: Record<string, string> = {
  available: 'bg-emerald-500',
  sold: 'bg-[#687386]',
  pending: 'bg-amber-400',
};
const statusLabel: Record<string, string> = {
  available: 'Available',
  sold: 'Sold',
  pending: 'Pending',
};

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  status = 'available',
  refNumber,
  name = '',
  location = '',
  beds = 0,
  baths = 0,
  sqft = 0,
}) => {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-8 pb-0">
      {/* Status + ref */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${statusDot[status]}`} />
          <span className="font-manrope text-xs font-medium text-[#687386] uppercase tracking-wider">
            {statusLabel[status]}
          </span>
        </div>
        {refNumber && (
          <>
            <span className="text-[#c6a56b]">·</span>
            <span className="font-space-mono text-xs text-[#687386]">{refNumber}</span>
          </>
        )}
      </div>

      {/* Name */}
      <h1 className="font-fraunces text-3xl md:text-4xl font-semibold text-[#253247] leading-tight mb-2 text-wrap-balance">
        {name}
      </h1>

      {/* Location */}
      <div className="flex items-center gap-1.5 mb-5">
        <MapPin className="w-4 h-4 text-[#142c4e] shrink-0" aria-hidden />
        <span className="font-manrope text-sm text-[#687386]">{location}</span>
      </div>

      {/* Specs — dot-separated inline */}
      <div className="flex items-center gap-2 font-manrope text-sm text-[#253247] border-b border-[#e5e7eb] pb-6">
        <span><strong className="font-semibold tabular-nums">{beds}</strong> {beds === 1 ? 'Bedroom' : 'Bedrooms'}</span>
        <span className="text-[#c6a56b]">·</span>
        <span><strong className="font-semibold tabular-nums">{baths}</strong> {baths === 1 ? 'Bathroom' : 'Bathrooms'}</span>
        <span className="text-[#c6a56b]">·</span>
        <span><strong className="font-semibold tabular-nums">{sqft.toLocaleString()}</strong> sqft</span>
      </div>
    </div>
  );
};

export default PropertyHeader;
