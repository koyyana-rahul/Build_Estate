import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface PropertyCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  badge?: string;
  tags?: string[];
}

const badgeStyle: Record<string, string> = {
  'HOT': 'bg-primary text-primary-foreground',
  'FOR RENT': 'bg-secondary text-secondary-foreground',
  'SOLD': 'bg-muted text-muted-foreground',
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  id, image, name, price, location, beds, baths, sqft, badge, tags = []
}) => {
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => setImageError(true);

  return (
    <Link
      to={`/property/${id}`}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-xl"
      aria-label={name}
    >
      <article className="flex flex-col bg-card border border-border rounded-xl shadow-card hover:shadow-md transition-all duration-200">

        {/* ── Image ──────────────────────────────────────── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {/* Legibility overlay for the price badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/20 to-black/60 pointer-events-none" />

          {imageError ? (
            <div className="flex h-full items-center justify-center text-muted-foreground/50">
              <div className="flex flex-col items-center gap-1.5">
                <ImageIcon className="w-12 h-12 opacity-60" aria-hidden="true" />
                <p className="text-[10px] font-semibold uppercase tracking-wider">Image unavailable</p>
              </div>
            </div>
          ) : (
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transform transition duration-500 ease-out group-hover:scale-105"
              onError={handleImageError}
            />
          )}

          {/* Price overlay — bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pt-10">
            <p className="font-heading text-lg font-bold text-white leading-none tabular-nums">
              {price}
            </p>
          </div>

          {/* Status badge */}
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

          {/* Favourite */}
          <button
            aria-label={isFavorite(id) ? 'Remove from favourites' : 'Add to favourites'}
            disabled={favoriteLoading}
            onClick={async (e) => {
              e.preventDefault();
              if (!isAuthenticated) {
                toast.info('Sign in to save properties to your account.');
                return;
              }
              setFavoriteLoading(true);
              try {
                await toggleFavorite(id);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unable to update saved property.');
              } finally {
                setFavoriteLoading(false);
              }
            }}
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-white/90 border border-border shadow-sm hover:bg-white transition-colors active:scale-95 disabled:opacity-60"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isFavorite(id) ? 'text-primary fill-primary' : 'text-foreground-soft'}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* ── Content ────────────────────────────────────── */}
        <div className="px-4 py-4 flex-grow flex flex-col">
          {/* Name */}
          <h3 className="font-heading text-base font-semibold text-foreground leading-tight text-wrap-balance line-clamp-2 mb-2">
            {name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
            <span className="text-xs text-muted-foreground truncate">{location}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
            <span>{beds} {beds === 1 ? 'Bed' : 'Beds'}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>{baths} {baths === 1 ? 'Bath' : 'Baths'}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>{sqft.toLocaleString()} sqft</span>
          </div>

          {/* Type tag — only first tag, subtle */}
          {tags[0] && (
            <div className="mt-3">
              <span className="inline-block text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded px-2 py-0.5">
                {tags[0]}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default PropertyCard;
