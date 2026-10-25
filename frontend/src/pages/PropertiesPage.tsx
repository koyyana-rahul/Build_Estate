import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, SearchX } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FilterBar, { FilterState } from '../components/properties/FilterBar';
import PropertiesGrid from '../components/properties/PropertiesGrid';
import LoadingState from '../components/common/LoadingState';
import { Button } from '../components/ui/button';
import { propertiesAPI } from '../services/api';
import { useSEO } from '../hooks/useSEO';

export interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string[];
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  availability: string;
  description: string;
  amenities: string[];
  phone: string;
}

const PropertiesPage: React.FC = () => {
  useSEO({
    title: 'Browse Properties in Mumbai, Delhi, Bangalore & More',
    description: 'Browse flats, villas, apartments, and houses for sale or rent in Mumbai, Delhi, Bangalore, Ahmedabad, and Pune. Filter by price, bedrooms, and location.',
    url: 'https://buildestate.vercel.app/properties',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState<FilterState>({});

  const fetchProperties = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await propertiesAPI.getAll();
        if (data.success && Array.isArray(data.property)) {
          setProperties(data.property);
        } else {
          setProperties([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (filters.location) {
      result = result.filter(p =>
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.propertyType?.length) {
      result = result.filter(p =>
        filters.propertyType!.some(t => t.toLowerCase() === p.type.toLowerCase())
      );
    }
    if (filters.availability) {
      result = result.filter(p =>
        p.availability.toLowerCase() === filters.availability!.toLowerCase()
      );
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      const minPrice = min * 1_000_000;
      const maxPrice = max * 1_000_000;
      result = result.filter(p => {
        if (p.price < minPrice) return false;
        if (max >= 200) return true;
        return p.price <= maxPrice;
      });
    }
    if (filters.bedrooms && filters.bedrooms > 0) {
      result = result.filter(p => p.beds >= filters.bedrooms!);
    }
    if (filters.bathrooms && filters.bathrooms > 0) {
      result = result.filter(p => p.baths >= filters.bathrooms!);
    }
    if (filters.amenities?.length) {
      result = result.filter(p =>
        filters.amenities!.every(fa =>
          p.amenities.some(pa => pa.toLowerCase() === fa.toLowerCase())
        )
      );
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'beds': result.sort((a, b) => b.beds - a.beds); break;
      case 'newest': result.sort((a, b) => b._id.localeCompare(a._id)); break;
    }

    return result;
  }, [properties, filters, sortBy]);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* ── Sticky filter bar ── */}
      <FilterBar
        totalProperties={filteredProperties.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onFilterChange={setFilters}
      />

      {/* ── Page title ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-2">
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
          All Properties
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Buy, sell, or rent homes across India's leading cities.
        </p>
      </div>

      {/* ── Content ── */}
      {loading && <LoadingState message="Loading properties…" />}

      {error && !loading && (
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-xs">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-2">
              Unable to load properties
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchProperties}>Retry</Button>
          </div>
        </div>
      )}

      {!loading && !error && filteredProperties.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center py-24"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted/50 text-muted-foreground mb-4">
              <SearchX className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
              No properties found
            </h2>
            <p className="text-muted-foreground mb-5">Try adjusting your filters or search for another location.</p>
            <Button variant="outline" onClick={() => setFilters({})}>Clear filters</Button>
          </div>
        </motion.div>
      )}

      {!loading && !error && filteredProperties.length > 0 && (
        <PropertiesGrid properties={filteredProperties} viewMode={viewMode} />
      )}

      <Footer />
    </div>
  );
};

export default PropertiesPage;
