import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { verifyTOTPForLogin } from '../../src/api/mfaApi';
import LoadingSpinner from '../LoadingSpinner';

interface MFAVerificationModalProps {
  mfaToken: string;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const MFAVerificationModal: React.FC<MFAVerificationModalProps> = ({
  mfaToken,
  onSuccess,
  onCancel,
  isOpen,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeType, setCodeType] = useState<'totp' | 'backup'>('totp');
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCode('');
      setError(null);
      setCodeType('totp');
      setAttemptCount(0);
    }
  }, [isOpen]);

  const { completeMFALogin } = useAuthStore();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }

    // Validate code format
    if (codeType === 'totp' && code.length !== 6) {
      setError('Authenticator code must be 6 digits');
      return;
    }

    if (codeType === 'backup' && !code.match(/^\d{4}-\d{4}-\d{4}$/)) {
      setError('Backup code format: XXXX-XXXX-XXXX');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Verify the code with the backend
      const response = await verifyTOTPForLogin(mfaToken, code);

      // Complete MFA login with the returned user data
      completeMFALogin({
        accessToken: 'mock-token', // Mock token for now
        user: response.user,
        expiresIn: 3600,
      });

      // Success callback
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify code';
      setError(errorMessage);
      setAttemptCount((prev) => prev + 1);

      if (attemptCount >= 4) {
        setError('Too many failed attempts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
        <p className="text-gray-600 mb-6">
          Enter the code from your authenticator app or use a backup code
        </p>

        <form onSubmit={handleVerifyCode} className="space-y-4">
          {/* Code Type Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setCodeType('totp');
                setCode('');
                setError(null);
              }}
              className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                codeType === 'totp'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Authenticator
            </button>
            <button
              type="button"
              onClick={() => {
                setCodeType('backup');
                setCode('');
                setError(null);
              }}
              className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                codeType === 'backup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Backup Code
            </button>
          </div>

          {/* Code Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {codeType === 'totp' ? '6-Digit Code' : 'Backup Code'}
            </label>

            {codeType === 'totp' ? (
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                value={code}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  // Auto-format with dashes
                  if (val.length <= 12) {
                    const formatted = val
                      .replace(/\D/g, '')
                      .replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
                      .slice(0, 14);
                    setCode(formatted);
                  }
                }}
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <p className="text-xs text-gray-500 mt-2">
              {codeType === 'totp'
                ? 'Find this in your authenticator app (changes every 30 seconds)'
                : 'Use a backup code to sign in if you lose access to your authenticator'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Attempt Counter */}
          {attemptCount > 0 && attemptCount <= 4 && (
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-xs text-yellow-800">
                Failed attempts: {attemptCount}/5. Too many failed attempts will lock your account.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              (codeType === 'totp' && code.length !== 6) ||
              (codeType === 'backup' && !code.match(/^\d{4}-\d{4}-\d{4}$/)) ||
              attemptCount >= 5
            }
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify'
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>Don't have your authenticator app?</strong> Use your backup codes to sign in.
            Each code can only be used once.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MFAVerificationModal;
