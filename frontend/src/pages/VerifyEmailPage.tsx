import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import AuthHeader from '../components/auth/AuthHeader';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useSEO } from '../hooks/useSEO';

type VerificationStatus = 'loading' | 'success' | 'error';

const VerifyEmailPage: React.FC = () => {
  useSEO({ title: 'Verify Email', description: 'Verify your Aavasa email address.', noindex: true });
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const { data } = await userAPI.verifyEmail(token);
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Your email has been verified successfully!');
          // If backend returned a token, log the user in automatically
          if (data.token && data.user) {
            localStorage.setItem('buildestate_token', data.token);
            localStorage.setItem('buildestate_user', JSON.stringify(data.user));
            updateUser(data.user);
            setTimeout(() => navigate('/'), 3000);
          } else {
            setTimeout(() => navigate('/signin'), 4000);
          }
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message ||
          'Verification failed. The link may have expired or is invalid.'
        );
      }
    };

    verifyEmail();
  }, [token, navigate, updateUser]);

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center py-12 px-4">
      <div className="max-w-[480px] w-full">
        {/* Logo */}
        <AuthHeader />

        {/* Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 shadow-xl">
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#FBF4E8] rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-8 h-8 text-[#142c4e] animate-spin" />
              </div>
              <h1 className="font-syne font-bold text-2xl text-[#253247] mb-3">
                Verifying Your Email
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#253247]">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-syne font-bold text-2xl text-[#253247] mb-3">
                Email Verified!
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#253247] mb-6">
                {message}
              </p>
              <p className="font-manrope text-xs text-[#687386] mb-6">
                Redirecting you now...
              </p>
              <Link
                to="/signin"
                className="w-full inline-block bg-[#142c4e] text-white font-manrope font-bold py-3 rounded-xl hover:bg-[#142c4e] transition-all text-center"
              >
                Sign In Now
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="font-syne font-bold text-2xl text-[#253247] mb-3">
                Verification Failed
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#253247] mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  to="/signin"
                  className="w-full inline-block bg-[#142c4e] text-white font-manrope font-bold py-3 rounded-xl hover:bg-[#142c4e] transition-all text-center"
                >
                  Try Signing In
                </Link>
                <p className="font-manrope text-xs text-[#687386]">
                  If your link expired, signing in will send a new verification email.
                </p>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 font-manrope font-medium text-sm text-[#687386] hover:text-[#142c4e] transition-[color]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
