import { Loader2 } from "lucide-react";
import React from "react";

type Step1Props = {
  step: number;
  handleVerification: (e: React.FormEvent<HTMLFormElement>) => void;
  verificationCode: string;
  setVerificationCode: (verificationCode: string) => void;
  phoneNumber: string;
  error: string;
  loading: boolean;
  resetForm: () => void;
};

function Step1({
  step,
  handleVerification,
  verificationCode,
  setVerificationCode,
  phoneNumber,
  error,
  loading,
  resetForm,
}: Step1Props) {
  if (step !== 1) return null;
  return (
    <form onSubmit={handleVerification} className="space-y-6">
      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Verification Code
        </label>
        <input
          id="code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="123456"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest"
          maxLength={6}
          required
        />
        <p className="text-xs text-gray-500 mt-1 text-center">
          Enter the 6-digit code sent to {phoneNumber}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={loading || verificationCode.length !== 6}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors cursor-pointer"
        >
          Use Different Number
        </button>
      </div>
    </form>
  );
}

export default Step1;
