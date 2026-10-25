import React from 'react';
import { motion, type Variants } from 'framer-motion';
import PropertyCard from './PropertyCard';
import type { Property } from '../../pages/PropertiesPage';
import { formatPrice } from '../../utils/formatPrice';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';

const fallbackImages = [
  "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=800",
  "https://images.unsplash.com/photo-1695067440629-b5e513976100?w=800",
  "https://images.unsplash.com/photo-1738168279272-c08d6dd22002?w=800",
  "https://images.unsplash.com/photo-1769428003672-296f923d19b2?w=800",
  "https://images.unsplash.com/photo-1761509386107-9baefe0073f2?w=800",
  "https://images.unsplash.com/photo-1762732793012-8bdab3af00b4?w=800",
];

interface PropertiesGridProps {
  properties: Property[];
  viewMode?: 'grid' | 'list';
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const badgeStyle: Record<string, string> = {
  'HOT': 'bg-primary text-primary-foreground',
  'FOR RENT': 'bg-secondary text-secondary-foreground',
  'SOLD': 'bg-muted text-muted-foreground border border-border',
};

// List view row — more compact than the card
const PropertyRow: React.FC<{ property: Property; index: number }> = ({ property, index }) => {
  const img = property.image?.[0] || fallbackImages[index % fallbackImages.length];
  const badge = property.availability === 'sold' ? 'SOLD'
    : property.availability === 'rent' ? 'FOR RENT'
    : property.availability === 'sale' ? 'FOR SALE'
    : property.availability?.toUpperCase();

  return (
    <Link
      to={`/property/${property._id}`}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      aria-label={property.title}
    >
      <div className="bg-card border border-border rounded-xl shadow-card hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-0 overflow-hidden">
        {/* Thumbnail */}
        <div className="relative w-full h-52 sm:w-52 sm:h-auto shrink-0 overflow-hidden bg-muted">
          <img
            src={img}
            alt={property.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transform transition duration-500 ease-out group-hover:scale-105"
          />
          {badge && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`
                  inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wider border
                  ${badgeStyle[badge] ?? 'bg-muted text-muted-foreground border-border'}
                `}
              >
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 py-4 sm:py-5 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground leading-tight mb-1 line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
              <span className="text-sm text-muted-foreground truncate">{property.location}</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-sm text-muted-foreground tabular-nums">
              <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-primary" />{property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}</span>
              <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-primary" />{property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}</span>
              <span className="flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5 text-primary" />{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="font-heading text-xl sm:text-2xl font-bold text-primary tabular-nums">
              {formatPrice(property.price)}
            </p>
            {property.type && (
              <span className="text-xs uppercase tracking-wider text-muted-foreground border border-border rounded px-2 py-0.5">
                {property.type}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const PropertiesGrid: React.FC<PropertiesGridProps> = ({ properties, viewMode = 'grid' }) => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-16 pt-4">
      {viewMode === 'grid' ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
        >
          {properties.map((property, index) => (
            <motion.div key={property._id} variants={item}>
              <PropertyCard
                id={property._id}
                image={property.image?.[0] || fallbackImages[index % fallbackImages.length]}
                name={property.title}
                price={formatPrice(property.price)}
                location={property.location}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                badge={
                  property.availability === 'sold' ? 'SOLD' :
                  property.availability === 'rent' ? 'FOR RENT' :
                  property.availability === 'sale' ? 'FOR SALE' :
                  property.availability?.toUpperCase()
                }
                tags={property.type ? [property.type] : []}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          {properties.map((property, index) => (
            <motion.div key={property._id} variants={item}>
              <PropertyRow property={property} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PropertiesGrid;
