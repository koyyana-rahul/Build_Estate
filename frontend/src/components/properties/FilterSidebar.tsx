import React, { useState, useEffect, useRef } from 'react';

interface FilterSidebarProps {
  onFilterChange?: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const isFirstRender = useRef(true);

  // Aligned with backend: admin/src/pages/Add.jsx → PROPERTY_TYPES
  const propertyTypes = [
    { id: 'apartment', label: 'Apartment', icon: 'apartment' },
    { id: 'house', label: 'House', icon: 'house' },
    { id: 'villa', label: 'Villa', icon: 'villa' },
    { id: 'office', label: 'Office', icon: 'business' },
  ];

  const availabilityTypes = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
  ];

  // Aligned with backend: admin/src/constants/amenities.js (most common subset)
  const amenitiesList = [
    'Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security',
    'Clubhouse', 'Power Backup', 'Lift', 'Balcony', 'CCTV Surveillance',
    'Children Play Area', 'Gated Community',
  ];

  // Price display helper — shows L or Cr
  const formatPriceLabel = (value: number): string => {
    if (value >= 200) return '20+ Cr';
    if (value >= 10) return `${(value / 10).toFixed(value % 10 === 0 ? 0 : 1)} Cr`;
    return `${value * 10} L`;
  };

  // Auto-apply filters whenever any filter state changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const filters: any = {};
    if (selectedLocation) filters.location = selectedLocation;
    if (selectedPropertyType.length > 0) filters.propertyType = selectedPropertyType;
    if (selectedAvailability) filters.availability = selectedAvailability;
    if (priceRange[0] > 0 || priceRange[1] < 200) filters.priceRange = priceRange;
    if (bedrooms > 0) filters.bedrooms = bedrooms;
    if (bathrooms > 0) filters.bathrooms = bathrooms;
    if (selectedAmenities.length > 0) filters.amenities = selectedAmenities;

    onFilterChange?.(filters);
  }, [selectedLocation, selectedPropertyType, selectedAvailability, priceRange, bedrooms, bathrooms, selectedAmenities]);

  const handleReset = () => {
    setSelectedLocation('');
    setSelectedPropertyType([]);
    setSelectedAvailability('');
    setPriceRange([0, 200]);
    setBedrooms(0);
    setBathrooms(0);
    setSelectedAmenities([]);
    onFilterChange?.({});
  };

  const togglePropertyType = (type: string) => {
    if (selectedPropertyType.includes(type)) {
      setSelectedPropertyType(selectedPropertyType.filter(t => t !== type));
    } else {
      setSelectedPropertyType([...selectedPropertyType, type]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div className="w-[359px] bg-white border-r border-[#e5e7eb] h-screen sticky top-20 overflow-y-auto pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-manrope font-extralight text-lg text-[#253247]">
            Refine Your Search
          </h2>
          <button 
            onClick={handleReset}
            className="font-manrope font-extralight text-sm text-[#142c4e] hover:underline"
          >
            Reset all
          </button>
        </div>

        {/* Location Filter */}
        <div className="mb-8 border-b border-[#f7f5f0] pb-8">
          <h3 className="font-manrope font-bold text-sm text-[#253247] mb-4 uppercase tracking-wider">
            Location
          </h3>
          
          {/* Search Input */}
          <div className="relative mb-3">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#687386] text-lg">
              location_on
            </span>
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="City, neighborhood..."
              className="w-full bg-[#f7f5f0] border border-[#f7f5f0] rounded-lg pl-10 pr-4 py-3 font-manrope text-sm text-[#253247] placeholder:text-[#687386] focus:outline-none focus:border-[#142c4e] transition-all"
            />
          </div>
        </div>

        {/* Availability (Buy / Rent) */}
        <div className="mb-8 border-b border-[#f7f5f0] pb-8">
          <h3 className="font-manrope font-bold text-sm text-[#253247] mb-4 uppercase tracking-wider">
            Availability
          </h3>
          <div className="flex gap-3">
            {availabilityTypes.map((avail) => (
              <button
                key={avail.id}
                onClick={() => setSelectedAvailability(selectedAvailability === avail.id ? '' : avail.id)}
                className={`flex-1 h-11 rounded-xl border font-manrope font-bold text-sm transition-all ${
                  selectedAvailability === avail.id
                    ? 'bg-[#142c4e] border-[#142c4e] text-white shadow-md'
                    : 'bg-white border-[#e5e7eb] text-[#687386] hover:border-[#142c4e] hover:text-[#142c4e]'
                }`}
              >
                {avail.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8 border-b border-[#f7f5f0] pb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-manrope font-bold text-sm text-[#253247] uppercase tracking-wider">
              Price Range
            </h3>
            <span className="font-space-mono text-sm text-[#142c4e]">
              ₹{formatPriceLabel(priceRange[0])} - {formatPriceLabel(priceRange[1])}
            </span>
          </div>

          {/* Min slider */}
          <label className="font-manrope text-xs text-[#687386] mb-1 block">Min</label>
          <div className="relative mb-4 px-2">
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={priceRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val < priceRange[1]) setPriceRange([val, priceRange[1]]);
              }}
              className="w-full h-1.5 bg-[#e5e7eb] rounded-full appearance-none cursor-pointer accent-[#142c4e]"
            />
          </div>

          {/* Max slider */}
          <label className="font-manrope text-xs text-[#687386] mb-1 block">Max</label>
          <div className="relative mb-2 px-2">
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={priceRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > priceRange[0]) setPriceRange([priceRange[0], val]);
              }}
              className="w-full h-1.5 bg-[#e5e7eb] rounded-full appearance-none cursor-pointer accent-[#142c4e]"
            />
          </div>
          <div className="flex justify-between px-1">
             <span className="font-manrope text-xs text-[#687386]">₹0</span>
             <span className="font-manrope text-xs text-[#687386]">₹20 Cr+</span>
          </div>
        </div>

        {/* Property Type Filter */}
        <div className="mb-8 border-b border-[#f7f5f0] pb-8">
          <h3 className="font-manrope font-bold text-sm text-[#253247] mb-4 uppercase tracking-wider">
            Property Type
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => togglePropertyType(type.label)}
                className={`h-[80px] rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedPropertyType.includes(type.label)
                    ? 'bg-[#142c4e] border-[#142c4e] text-white shadow-md'
                    : 'bg-white border-[#e5e7eb] text-[#687386] hover:border-[#142c4e] hover:text-[#142c4e]'
                }`}
              >
                <span className="material-icons text-2xl">
                  {type.icon}
                </span>
                <span className="font-manrope font-medium text-sm">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div className="mb-8 border-b border-[#f7f5f0] pb-8">
          <h3 className="font-manrope font-bold text-sm text-[#253247] mb-4 uppercase tracking-wider">
            Bedrooms
          </h3>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setBedrooms(num)}
                className={`flex-1 h-10 rounded-lg font-manrope font-bold text-sm border transition-all ${
                  bedrooms === num
                    ? 'bg-[#142c4e] border-[#142c4e] text-white'
                    : 'bg-white border-[#e5e7eb] text-[#687386] hover:border-[#142c4e]'
                }`}
              >
                {num === 0 ? 'Any' : num === 5 ? '5+' : num}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div className="mb-8 border-b border-[#f7f5f0] pb-8">
          <h3 className="font-manrope font-bold text-sm text-[#253247] mb-4 uppercase tracking-wider">
            Bathrooms
          </h3>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setBathrooms(num)}
                className={`flex-1 h-10 rounded-lg font-manrope font-bold text-sm border transition-all ${
                  bathrooms === num
                    ? 'bg-[#142c4e] border-[#142c4e] text-white'
                    : 'bg-white border-[#e5e7eb] text-[#687386] hover:border-[#142c4e]'
                }`}
              >
                {num === 0 ? 'Any' : num === 4 ? '4+' : num}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-8">
          <h3 className="font-manrope font-bold text-sm text-[#253247] mb-4 uppercase tracking-wider">
            Amenities
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {amenitiesList.map((amenity) => (
              <label 
                key={amenity}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedAmenities.includes(amenity)
                    ? 'bg-[rgba(20,44,78,0.05)] border-[#142c4e]'
                    : 'bg-white border-[#e5e7eb] hover:border-[#142c4e]'
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-[background-color,border-color] ${
                  selectedAmenities.includes(amenity)
                    ? 'bg-[#142c4e] border-[#142c4e]'
                    : 'bg-white border-[#e5e7eb]'
                }`}>
                  {selectedAmenities.includes(amenity) && (
                    <span className="material-icons text-white text-xs font-bold">check</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                />
                <span className={`font-manrope text-sm ${
                   selectedAmenities.includes(amenity) ? 'text-[#142c4e] font-semibold' : 'text-[#253247]'
                }`}>
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={handleReset}
          className="w-full bg-white border border-[#142c4e] text-[#142c4e] font-manrope font-bold text-base py-4 rounded-xl transition-all hover:bg-[#142c4e] hover:text-white sticky bottom-0"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;