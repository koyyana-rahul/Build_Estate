import { useState, useEffect } from "react";
import {
  Trash2, Edit3, Search, Plus, Home, BedDouble, Bath,
  Maximize, MapPin, Grid3X3, List as ListIcon,
  Building2, SlidersHorizontal, ChevronDown, ChevronUp, X,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../services/apiClient";
import { cn, formatPrice } from "../lib/utils";
import useAutoRefresh from "../hooks/useAutoRefresh";

const PROPERTY_TYPES = ["all", "House", "Apartment", "Office", "Villa"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
];

const parseAmenities = (amenities) => {
  if (!amenities || !Array.isArray(amenities)) return [];
  try {
    return typeof amenities[0] === "string"
      ? JSON.parse(amenities[0].replace(/'/g, '"'))
      : amenities;
  } catch {
    return [];
  }
};

// ─── Property Grid Card ───────────────────────────────────────────────────────
const PropertyGridCard = ({ property, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.25 }}
    className="bg-white rounded-2xl border border-[#e5e7eb] shadow-card hover:shadow-card-hover overflow-hidden group transition-shadow duration-300"
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden bg-[#f7f5f0]">
      {property.image?.[0] ? (
        <img src={property.image[0]} alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Building2 className="w-12 h-12 text-[#e5e7eb]" />
        </div>
      )}
      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-1.5">
        <span className="px-2.5 py-1 bg-[#253247]/80 backdrop-blur-sm text-[#f7f5f0] text-xs font-semibold rounded-full">
          {property.type}
        </span>
        <span className={cn(
          "px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm",
          property.availability === "rent"
            ? "bg-[#315b78]/90 text-white"
            : "bg-[#142c4e]/80 text-white"
        )}>
          {property.availability === "rent" ? "For Rent" : "For Sale"}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <h3 className="font-bold text-[#253247] text-base leading-snug mb-1 line-clamp-2">{property.title}</h3>
      <div className="flex items-center gap-1 text-[#687386] text-xs mb-3">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="line-clamp-1">{property.location}</span>
      </div>

      {/* Specs */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#687386] mb-4">
        <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-[#142c4e]" />{property.beds} Beds</span>
        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-[#142c4e]" />{property.baths} Baths</span>
        <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5 text-[#142c4e]" />{property.sqft} sqft</span>
      </div>

      {/* Price + Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f7f5f0]">
        <div>
          <span className="text-lg font-bold text-[#142c4e]">{formatPrice(property.price)}</span>
          {property.availability === "rent" && <span className="text-xs text-[#687386] ml-1">/mo</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <Link to={`/update/${property._id}`} aria-label={`Edit ${property.title}`}>
            <span
              className="inline-flex p-2 bg-[#f7f5f0] border border-[#e5e7eb] text-[#687386] rounded-lg hover:border-[#142c4e] hover:text-[#142c4e] transition-all duration-200">
              <Edit3 className="w-4 h-4" />
            </span>
          </Link>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onRemove(property._id, property.title)}
            aria-label={`Remove ${property.title}`}
            className="p-2 bg-[#f7f5f0] border border-[#e5e7eb] text-[#687386] rounded-lg hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200">
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Property List Row ────────────────────────────────────────────────────────
const PropertyListRow = ({ property, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    className="flex flex-wrap items-center gap-3 p-3 sm:p-4 bg-white rounded-xl border border-[#e5e7eb] hover:border-[#142c4e]/30 hover:shadow-card transition-all duration-200"
  >
    {/* Thumbnail */}
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#f7f5f0] flex-shrink-0">
      {property.image?.[0] ? (
        <img src={property.image[0]} alt={property.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Building2 className="w-6 h-6 text-[#e5e7eb]" />
        </div>
      )}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-[calc(100%-4.5rem)] sm:min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-0.5">
        <h3 className="font-semibold text-[#253247] text-sm truncate">{property.title}</h3>
        <span className="px-2 py-0.5 bg-[#253247] text-[#f7f5f0] text-xs rounded-full flex-shrink-0">{property.type}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-[#687386]">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{property.location}</span>
      </div>
    </div>

    {/* Specs */}
    <div className="hidden md:flex items-center gap-4 text-xs text-[#687386]">
      <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-[#142c4e]" />{property.beds}</span>
      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-[#142c4e]" />{property.baths}</span>
      <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5 text-[#142c4e]" />{property.sqft}</span>
    </div>

    {/* Price */}
    <div className="w-full sm:w-auto sm:text-right flex-shrink-0 pl-[4.25rem] sm:pl-0">
      <div className="font-bold text-[#142c4e] text-sm">{formatPrice(property.price)}</div>
      <div className={cn(
        "text-xs font-medium mt-0.5",
        property.availability === "rent" ? "text-[#315b78]" : "text-[#287a55]"
      )}>
        {property.availability === "rent" ? "For Rent" : "For Sale"}
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
      <Link to={`/update/${property._id}`} aria-label={`Edit ${property.title}`}>
        <span
          className="inline-flex p-2 text-[#687386] hover:text-[#142c4e] hover:bg-[#142c4e]/10 rounded-lg transition-all duration-200">
          <Edit3 className="w-4 h-4" />
        </span>
      </Link>
      <button onClick={() => onRemove(property._id, property.title)}
        aria-label={`Remove ${property.title}`}
        className="p-2 text-[#687386] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/products/list');
      if (response.data.success) {
        const parsed = response.data.property.map((p) => ({
          ...p,
          amenities: parseAmenities(p.amenities),
        }));
        setProperties(parsed);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProperty = async (propertyId, propertyTitle) => {
    if (!window.confirm(`Remove "${propertyTitle}"? This cannot be undone.`)) return;
    try {
      const response = await apiClient.post('/api/products/remove', { id: propertyId });
      if (response.data.success) {
        toast.success("Property removed successfully");
        await fetchProperties();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing property:", error);
      toast.error("Failed to remove property");
    }
  };

  useEffect(() => { fetchProperties(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useAutoRefresh(fetchProperties, 60000);

  const filteredProperties = properties
    .filter((p) => {
      const matchesSearch = !searchTerm ||
        [p.title, p.location, p.type].some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === "all" || p.type?.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const hasActiveFilters = Boolean(searchTerm || filterType !== "all");
  const activeFilterCount = Number(Boolean(searchTerm)) + Number(filterType !== "all");
  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#142c4e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#687386] font-medium">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 sm:pt-8 pb-12 px-4 bg-[#f7f5f0]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#253247] mb-1">Properties</h1>
            <p className="text-[#687386] text-sm">
              <span className="font-semibold text-[#142c4e]">{filteredProperties.length}</span> listings found
              {hasActiveFilters && <span> with current filters</span>}
            </p>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Link to="/add" className="flex-1 sm:flex-none">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-[#142c4e] hover:bg-[#0f2340] text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-terracotta">
                <Plus className="w-4 h-4" />
                Add Property
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e5e7eb] shadow-card mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* Search */}
              <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687386]" />
              <input type="text" placeholder="Search properties..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#f7f5f0] border border-[#e5e7eb] rounded-xl text-sm text-[#253247] placeholder-[#687386] outline-none focus:border-[#142c4e] focus:ring-2 focus:ring-[#142c4e]/15 transition-all" />
              </div>

              <button type="button" onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen} aria-controls="property-filters"
                className={cn(
                  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
                  filtersOpen || hasActiveFilters
                    ? "border-[#142c4e] bg-[#eef3f8] text-[#142c4e]"
                    : "border-[#e5e7eb] bg-white text-[#253247] hover:border-[#142c4e]"
                )}>
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#142c4e] px-1.5 text-[11px] text-white">
                    {activeFilterCount}
                  </span>
                )}
                {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {/* Sort + View Toggle */}
              <div className="flex w-full items-center gap-2 lg:w-auto">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort properties"
                className="min-w-0 flex-1 max-w-full px-3 py-2.5 bg-[#f7f5f0] border border-[#e5e7eb] rounded-xl text-xs text-[#687386] outline-none focus:border-[#142c4e] transition-all cursor-pointer lg:w-44 lg:flex-none">
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <div className="flex items-center bg-[#f7f5f0] border border-[#e5e7eb] rounded-xl p-1">
                <button type="button" onClick={() => setViewMode("grid")} aria-label="Grid view"
                  className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-[#253247] text-white" : "text-[#687386] hover:text-[#253247]")}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setViewMode("list")} aria-label="List view"
                  className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-[#253247] text-white" : "text-[#687386] hover:text-[#253247]")}>
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
              </div>
            </div>

            {filtersOpen && (
              <motion.div id="property-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} className="border-t border-[#eef0f2] pt-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto bg-[#f7f5f0] rounded-xl p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {PROPERTY_TYPES.map((type) => (
                      <button key={type} onClick={() => setFilterType(type)} type="button"
                        className={cn(
                          "shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 capitalize whitespace-nowrap",
                          filterType === type ? "bg-[#253247] text-[#f7f5f0] shadow-sm" : "text-[#687386] hover:text-[#253247]"
                        )}>
                        {type === "all" ? "All Types" : type}
                      </button>
                    ))}
                  </div>
                  {hasActiveFilters && (
                    <button type="button" onClick={clearFilters}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#142c4e] hover:bg-[#eef3f8] rounded-xl transition-colors">
                      <X className="h-3.5 w-3.5" /> Clear filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Properties */}
        <AnimatePresence mode="wait">
          {filteredProperties.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 bg-white rounded-2xl border border-[#e5e7eb]">
              <div className="w-16 h-16 bg-[#f7f5f0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-[#e5e7eb]" />
              </div>
              <h3 className="text-lg font-bold text-[#253247] mb-2">No properties found</h3>
              <p className="text-sm text-[#687386] mb-6">
                {hasActiveFilters ? "Try adjusting your search or filters" : "Add your first property to get started"}
              </p>
              {hasActiveFilters ? (
                <button type="button" onClick={clearFilters}
                  className="px-6 py-3 bg-[#eef3f8] text-[#142c4e] rounded-xl font-semibold text-sm hover:bg-[#e2eaf2] transition-colors">
                  Clear Filters
                </button>
              ) : (
                <Link to="/add">
                  <button className="px-6 py-3 bg-[#142c4e] text-white rounded-xl font-semibold text-sm hover:bg-[#0f2340] transition-colors">
                    Add First Property
                  </button>
                </Link>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              <AnimatePresence>
                {filteredProperties.map((property) => (
                  <PropertyGridCard key={property._id} property={property} onRemove={handleRemoveProperty} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-3">
              <AnimatePresence>
                {filteredProperties.map((property) => (
                  <PropertyListRow key={property._id} property={property} onRemove={handleRemoveProperty} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyListings;