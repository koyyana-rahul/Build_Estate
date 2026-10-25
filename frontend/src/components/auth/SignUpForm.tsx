import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface SignUpFormProps {
  onSubmit: (data: any) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* First Name & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-manrope font-extralight text-xs text-[#687386] uppercase tracking-wider mb-2">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#687386]" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              className="w-full bg-[#f7f5f0] border border-[#e5e7eb] rounded-lg pl-12 pr-4 py-3.5 font-manrope font-extralight text-sm text-[#253247] placeholder:text-[#687386] focus:outline-none focus:border-[#142c4e] transition-[border-color]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-manrope font-extralight text-xs text-[#687386] uppercase tracking-wider mb-2">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#687386]" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              className="w-full bg-[#f7f5f0] border border-[#e5e7eb] rounded-lg pl-12 pr-4 py-3.5 font-manrope font-extralight text-sm text-[#253247] placeholder:text-[#687386] focus:outline-none focus:border-[#142c4e] transition-[border-color]"
              required
            />
          </div>
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label className="block font-manrope font-extralight text-xs text-[#687386] uppercase tracking-wider mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#687386]" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
            className="w-full bg-[#f7f5f0] border border-[#e5e7eb] rounded-lg pl-12 pr-4 py-3.5 font-manrope font-extralight text-sm text-[#253247] placeholder:text-[#687386] focus:outline-none focus:border-[#142c4e] transition-[border-color]"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="block font-manrope font-extralight text-xs text-[#687386] uppercase tracking-wider mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#687386]" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a strong password"
            className="w-full bg-[#f7f5f0] border border-[#e5e7eb] rounded-lg pl-12 pr-12 py-3.5 font-manrope font-extralight text-sm text-[#253247] placeholder:text-[#687386] focus:outline-none focus:border-[#142c4e] transition-[border-color]"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#687386] hover:text-[#142c4e] transition-[color]"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div>
        <label className="block font-manrope font-extralight text-xs text-[#687386] uppercase tracking-wider mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#687386]" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Re-enter your password"
            className="w-full bg-[#f7f5f0] border border-[#e5e7eb] rounded-lg pl-12 pr-12 py-3.5 font-manrope font-extralight text-sm text-[#253247] placeholder:text-[#687386] focus:outline-none focus:border-[#142c4e] transition-[border-color]"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#687386] hover:text-[#142c4e] transition-[color]"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="w-4 h-4 mt-0.5 rounded border-[#e5e7eb] text-[#142c4e] focus:ring-[#142c4e]"
            required
          />
          <span className="font-manrope font-extralight text-sm text-[#253247] leading-relaxed">
            I agree to the{' '}
            <Link to="/terms" className="text-[#142c4e] hover:text-[#142c4e] font-medium">
              Terms & Conditions
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-[#142c4e] hover:text-[#142c4e] font-medium">
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#142c4e] hover:bg-[#142c4e] text-white font-manrope font-bold text-base py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;