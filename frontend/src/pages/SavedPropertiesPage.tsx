import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropertiesGrid from '../components/properties/PropertiesGrid';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useSEO } from '../hooks/useSEO';
import type { Property } from './PropertiesPage';

const SavedPropertiesPage: React.FC = () => {
  useSEO({ title: 'Saved Properties', description: 'View properties saved to your BuildEstate account.', noindex: true });
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedProperties = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getFavorites();
      setProperties(data.properties || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to load saved properties.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin', { replace: true });
      return;
    }
    if (isAuthenticated) void fetchSavedProperties();
  }, [fetchSavedProperties, isAuthenticated, isLoading, navigate]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Your shortlist</p>
            <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground">
              Saved properties
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved to your account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchSavedProperties()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        </div>

        {properties.length > 0 ? (
          <PropertiesGrid properties={properties} />
        ) : (
          <div className="mx-auto max-w-md py-20 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
              No saved properties yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Save properties while browsing to compare them later.
            </p>
            <Link
              to="/properties"
              className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Browse properties
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedPropertiesPage;
