import { Loader2, Phone } from "lucide-react";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationStep0 } from "./schema";

type Step0Props = {
  step: number;
  handleLogin: (values: { phoneNumber: string }) => void;
  error: string;
  loading: boolean;
};

function Step0({ step, handleLogin, error, loading }: Step0Props) {
  if (step !== 0) return null;

  const initialValues = {
    phoneNumber: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationStep0}
      onSubmit={(values) => handleLogin(values)}
    >
      {({ errors, touched, handleChange }) => (
        <Form className="space-y-6">
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Field
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+20 123 456 7890"
                className={`w-full pl-12 pr-4 py-3 border ${
                  errors.phoneNumber && touched.phoneNumber
                    ? "border-red-300"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (/^\+?\d*$/.test(value)) {
                    handleChange(e);
                  }
                }}
              />
            </div>
            <ErrorMessage
              name="phoneNumber"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your Egyptian phone number
            </p>
            <p className="text-xs text-gray-500 mt-1">
              (01222841166 or 01222841165)
            </p>
            <p className="text-xs text-gray-500 mt-1">(123456 or 654321)</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
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
        </Form>
      )}
    </Formik>
  );
}

export default Step0;
