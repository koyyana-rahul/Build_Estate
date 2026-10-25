import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import apiClient from '../services/apiClient';
import { X, Upload, Home, MapPin, Phone, DollarSign, BedDouble, Bath, Maximize, Link as LinkIcon, CheckSquare, Square, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { AMENITIES_LIST } from '../constants/amenities';
import { cn } from '../lib/utils';

const PROPERTY_TYPES = ['House', 'Apartment', 'Office', 'Villa'];
const AVAILABILITY_TYPES = ['rent', 'buy'];
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClass = "w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-[#253247] placeholder-[#687386] text-sm transition-all duration-200 outline-none focus:border-[#142c4e] focus:ring-2 focus:ring-[#142c4e]/15";
const labelClass = "block text-sm font-semibold text-[#253247] mb-2";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 bg-[#142c4e]/10 rounded-xl flex items-center justify-center">
      <Icon className="w-4.5 h-4.5 text-[#142c4e]" />
    </div>
    <div>
      <h3 className="text-base font-bold text-[#253247]">{title}</h3>
      {subtitle && <p className="text-xs text-[#687386]">{subtitle}</p>}
    </div>
  </div>
);

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', type: '', price: '', location: '', description: '',
    beds: '', baths: '', sqft: '', phone: '', availability: '',
    amenities: [], googleMapLink: '', images: [],
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await apiClient.get(`/api/products/single/${id}`);
        if (response.data.success) {
          const property = response.data.property;
          let amenities = property.amenities || [];
          if (amenities.length === 1 && typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
            try { amenities = JSON.parse(amenities[0]); } catch { /* keep as-is */ }
          }
          setFormData({
            title: property.title, type: property.type, price: property.price,
            location: property.location, description: property.description,
            beds: property.beds, baths: property.baths, sqft: property.sqft,
            phone: property.phone, availability: property.availability,
            amenities, googleMapLink: property.googleMapLink || '', images: property.image,
          });
          setPreviewUrls(property.image);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details.');
      } finally {
        setFetching(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity('');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.some((file) => !ACCEPTED_IMAGE_TYPES.includes(file.type))) {
      toast.error('Use JPEG, PNG, GIF, or WebP images only');
      e.target.value = '';
      return;
    }
    if (files.some((file) => file.size > MAX_IMAGE_SIZE)) {
      toast.error('Each image must be 5 MB or smaller');
      e.target.value = '';
      return;
    }
    if (files.length > 4) {
      toast.error('Maximum 4 images allowed');
      e.target.value = '';
      return;
    }
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const removeImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append('id', id);
      ['title', 'type', 'price', 'location', 'description', 'beds', 'baths', 'sqft', 'phone', 'availability', 'googleMapLink'].forEach((key) => {
        formdata.append(key, formData[key]);
      });
      formData.amenities.forEach((amenity, i) => formdata.append(`amenities[${i}]`, amenity));
      formData.images.forEach((image, i) => {
        if (typeof image !== 'string') formdata.append(`image${i + 1}`, image);
      });

      const response = await apiClient.post('/api/products/update', formdata);
      if (response.data.success) {
        toast.success('Property updated successfully!');
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#142c4e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#687386] font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 sm:pt-8 pb-12 px-4 bg-[#f7f5f0]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <button onClick={() => navigate('/list')}
            className="flex items-center gap-2 text-sm text-[#687386] hover:text-[#142c4e] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#253247] mb-1">Update Property</h1>
          <p className="text-[#687386]">Edit and save changes to this property listing</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#e5e7eb] shadow-card">
            <SectionHeader icon={Home} title="Basic Information" />
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>Property Title</label>
                <input type="text" id="title" name="title" required value={formData.title}
                  onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea id="description" name="description" required value={formData.description}
                  onChange={handleInputChange} rows={4} className={cn(inputClass, 'resize-none')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className={labelClass}>Property Type</label>
                  <select id="type" name="type" required value={formData.type}
                    onChange={handleInputChange} className={inputClass}>
                    <option value="">Select Type</option>
                    {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="availability" className={labelClass}>Availability</label>
                  <select id="availability" name="availability" required value={formData.availability}
                    onChange={handleInputChange} className={inputClass}>
                    <option value="">Select Availability</option>
                    {AVAILABILITY_TYPES.map((type) => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Pricing */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#e5e7eb] shadow-card">
            <SectionHeader icon={MapPin} title="Location & Pricing" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelClass}>Price (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687386]" />
                  <input type="number" id="price" name="price" required min="0"
                    value={formData.price} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="location" className={labelClass}>Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687386]" />
                  <input type="text" id="location" name="location" required
                    value={formData.location} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687386]" />
                  <input type="tel" id="phone" name="phone" required
                    value={formData.phone} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="googleMapLink" className={labelClass}>
                  Google Maps Link <span className="text-[#687386] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687386]" />
                  <input type="url" id="googleMapLink" name="googleMapLink"
                    value={formData.googleMapLink} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#e5e7eb] shadow-card">
            <SectionHeader icon={Maximize} title="Property Details" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'beds', label: 'Bedrooms', icon: BedDouble },
                { id: 'baths', label: 'Bathrooms', icon: Bath },
                { id: 'sqft', label: 'Square Feet', icon: Maximize },
              ].map(({ id: fieldId, label, icon: Icon }) => (
                <div key={fieldId}>
                  <label htmlFor={fieldId} className={labelClass}>{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687386]" />
                    <input type="number" id={fieldId} name={fieldId} required min="0"
                      value={formData[fieldId]} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-card">
            <SectionHeader icon={CheckSquare} title="Amenities" />
            <div className="flex flex-wrap gap-2 mb-4">
              {AMENITIES_LIST.map((amenity) => {
                const selected = formData.amenities.includes(amenity);
                return (
                  <button key={amenity} type="button" onClick={() => handleAmenityToggle(amenity)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                      selected
                        ? 'bg-[#142c4e] text-white shadow-sm'
                        : 'bg-[#f7f5f0] text-[#687386] border border-[#e5e7eb] hover:border-[#142c4e] hover:text-[#142c4e]'
                    )}>
                    {selected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                placeholder="Add custom amenity..." className={cn(inputClass, 'flex-1')} />
              <button type="button" onClick={handleAddAmenity}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#253247] text-white rounded-xl text-sm font-medium hover:bg-[#142c4e] transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {formData.amenities.filter((a) => !AMENITIES_LIST.includes(a)).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.amenities.filter((a) => !AMENITIES_LIST.includes(a)).map((amenity) => (
                  <span key={amenity}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#142c4e]/10 text-[#142c4e] rounded-full text-sm font-medium">
                    {amenity}
                    <button type="button" onClick={() => handleAmenityToggle(amenity)}
                      className="hover:text-[#0f2340]"><X size={13} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-card">
            <SectionHeader icon={Upload} title="Property Images" subtitle={`${previewUrls.length}/4 images`} />
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-square">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#e5e7eb] rounded-xl cursor-pointer bg-[#f7f5f0] hover:border-[#142c4e] hover:bg-[#142c4e]/5 transition-all duration-200 group">
              <Upload className="w-6 h-6 text-[#687386] group-hover:text-[#142c4e] mb-1.5 transition-colors" />
              <span className="text-sm font-medium text-[#687386] group-hover:text-[#142c4e] transition-colors">
                Replace images
              </span>
              <input id="images" name="images" type="file" multiple accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={handleImageChange} className="sr-only" />
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/list')}
              className="flex-1 py-4 bg-white border border-[#e5e7eb] text-[#253247] rounded-xl font-semibold text-base hover:bg-[#f7f5f0] transition-colors">
              Cancel
            </button>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#253247] hover:bg-[#142c4e] text-[#f7f5f0] rounded-xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-terracotta disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Update;