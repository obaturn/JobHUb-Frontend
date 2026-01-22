import React, { useState, useEffect } from 'react';
import { setupMFA, verifyMFASetup, disableMFA, getMFAStatus } from '../../src/api/mfaApi';
import LoadingSpinner from '../LoadingSpinner';

interface MFASettingsProps {
  compact?: boolean;
}

const MFASettings: React.FC<MFASettingsProps> = ({ compact = false }) => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // MFA Setup States
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState<'qr' | 'verify' | 'backup'>('qr');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // MFA Disable States
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  // Fetch MFA status on component mount
  useEffect(() => {
    fetchMFAStatus();
  }, []);

  const fetchMFAStatus = async () => {
    try {
      setLoading(true);
      const status = await getMFAStatus();
      setMfaEnabled(status.mfaEnabled);
    } catch (err) {
      console.error('Error fetching MFA status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMFA = async () => {

    try {
      setLoading(true);
      setError(null);
      const setupData = await setupMFA();

      setQrCode(setupData.qrCode);
      setSetupSecret(setupData.secret);
      setShowSetupModal(true);
      setSetupStep('qr');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!setupSecret || !verificationCode) return;

    try {
      setLoading(true);
      setError(null);

      const result = await verifyMFASetup(verificationCode, setupSecret);

      setBackupCodes(result.backupCodes);
      setSetupStep('backup');
      setMfaEnabled(true);
      setSuccess('MFA enabled successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify MFA code');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupCodesSaved = () => {
    setShowSetupModal(false);
    setVerificationCode('');
    setBackupCodes([]);
    setSetupSecret(null);
    setQrCode(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDisableMFA = async () => {
    if (!disablePassword) return;

    try {
      setLoading(true);
      setError(null);

      await disableMFA(disablePassword);

      setMfaEnabled(false);
      setShowDisableModal(false);
      setDisablePassword('');
      setSuccess('MFA disabled successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const content = `JobHub MFA Backup Codes\n\nSave these codes in a safe place:\n\n${backupCodes.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobhub-mfa-backup-codes.txt';
    a.click();
  };

  const copyBackupCodesToClipboard = () => {
    const content = backupCodes.join('\n');
    navigator.clipboard.writeText(content).then(() => {
      setSuccess('Backup codes copied to clipboard');
      setTimeout(() => setSuccess(null), 2000);
    });
  };

  if (loading && !showSetupModal && !showDisableModal) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`${compact ? 'p-4' : 'p-6'} bg-white rounded-lg border border-gray-200`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enhance your account security with two-factor authentication
        </p>
      </div>

      {/* Current Status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Status</p>
            <p className={`text-sm font-semibold mt-1 ${mfaEnabled ? 'text-green-600' : 'text-yellow-600'}`}>
              {mfaEnabled ? '✓ Enabled' : '○ Disabled'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${mfaEnabled ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <span className={mfaEnabled ? 'text-green-600 text-xl' : 'text-yellow-600 text-xl'}>
              {mfaEnabled ? '✓' : '○'}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!mfaEnabled ? (
          <button
            onClick={handleEnableMFA}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Setting up...' : 'Enable MFA'}
          </button>
        ) : (
          <button
            onClick={() => setShowDisableModal(true)}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Disable MFA
          </button>
        )}
      </div>

      {/* MFA Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            {setupStep === 'qr' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Two-Factor Authentication</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.):
                    </p>
                    {qrCode && (
                      <div className="flex justify-center mb-4">
                        <img src={qrCode} alt="MFA QR Code" className="w-64 h-64 border-2 border-gray-200 rounded" />
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-xs text-yellow-800">
                      <strong>Can't scan?</strong> Enter this code manually in your app:
                    </p>
                    <code className="text-xs font-mono text-yellow-900 mt-2 break-words">{setupSecret}</code>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Enter the 6-digit code from your app
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleVerifyCode}
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>

                  <button
                    onClick={() => setShowSetupModal(false)}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {setupStep === 'backup' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Backup Codes</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-xs text-red-800 font-semibold">Important!</p>
                    <p className="text-xs text-red-800 mt-1">
                      Save these backup codes in a safe place. You'll need them if you lose access to your authenticator app.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-300 rounded p-4 max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="font-mono text-sm text-gray-700">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={downloadBackupCodes}
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Download
                    </button>
                    <button
                      onClick={copyBackupCodesToClipboard}
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>

                  <button
                    onClick={handleBackupCodesSaved}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    I've Saved the Codes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MFA Disable Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Disable MFA</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Disabling MFA will make your account less secure. You will no longer need to enter a verification code when logging in.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleDisableMFA}
                disabled={loading || !disablePassword}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Disabling...' : 'Disable MFA'}
              </button>

              <button
                onClick={() => {
                  setShowDisableModal(false);
                  setDisablePassword('');
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFASettings;
