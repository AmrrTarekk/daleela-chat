import { Loader2, Phone } from "lucide-react";
import React from "react";

type Step0Props = {
  step: number;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  error: string;
  loading: boolean;
};

function Step0({
  step,
  handleLogin,
  phoneNumber,
  setPhoneNumber,
  error,
  loading,
}: Step0Props) {
  if (step !== 0) return null;

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+20 123 456 7890"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter your Egyptian phone number
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !phoneNumber.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Sending...
          </>
        ) : (
          "Send Verification Code"
        )}
      </button>
    </form>
  );
}

export default Step0;
