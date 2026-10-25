import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AuthHeader from '../components/auth/AuthHeader';
import { userAPI } from '../services/api';
import { useSEO } from '../hooks/useSEO';

const ForgotPasswordPage: React.FC = () => {
  useSEO({ title: 'Forgot Password', description: 'Request a secure BuildEstate password reset link.', noindex: true });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await userAPI.forgotPassword(email);
      if (data.success) {
        setIsSuccess(true);
        toast.success('Reset link sent to your email!');
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center py-12 px-4">
      <div className="max-w-[480px] w-full">
        {/* Logo */}
        <AuthHeader />

        {/* Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 shadow-xl">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-syne font-bold text-2xl text-[#253247] mb-3">
                Check Your Email
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#253247] mb-6 leading-relaxed">
                We've sent a password reset link to{' '}
                <span className="font-semibold text-[#253247]">{email}</span>.
                <br />
                Please check your inbox and follow the instructions.
              </p>
              <p className="font-manrope font-extralight text-xs text-[#687386] mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="w-full bg-transparent border border-[#142c4e] text-[#142c4e] font-manrope font-bold py-3 rounded-xl hover:bg-[#142c4e] hover:text-white transition-all"
                >
                  Try Another Email
                </button>
                <Link
                  to="/signin"
                  className="w-full bg-[#142c4e] text-white font-manrope font-bold py-3 rounded-xl hover:bg-[#142c4e] transition-all text-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-[#FBF4E8] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-7 h-7 text-[#142c4e]" />
                </div>
                <h1 className="font-syne font-bold text-3xl text-[#253247] mb-2">
                  Forgot Password?
                </h1>
                <p className="font-manrope font-extralight text-sm text-[#253247]">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block font-manrope font-medium text-sm text-[#253247] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#687386]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#f7f5f0] border border-[#f7f5f0] rounded-xl pl-12 pr-4 py-3.5 font-manrope text-sm text-[#253247] placeholder:text-[#687386] focus:outline-none focus:border-[#142c4e] focus:ring-1 focus:ring-[#142c4e] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#142c4e] hover:bg-[#142c4e] disabled:opacity-60 disabled:cursor-not-allowed text-white font-manrope font-bold text-base py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {/* Back to Sign In */}
              <Link
                to="/signin"
                className="flex items-center justify-center gap-2 mt-6 font-manrope font-medium text-sm text-[#687386] hover:text-[#142c4e] transition-[color]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
