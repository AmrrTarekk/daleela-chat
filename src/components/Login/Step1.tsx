import { Loader2 } from "lucide-react";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

type Step1Props = {
  step: number;
  handleVerification: (values: { verificationCode: string }) => void;
  phoneNumber: string;
  error: string;
  loading: boolean;
  resetForm: () => void;
};

const validationSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .required("Verification code is required")
    .matches(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

function Step1({
  step,
  handleVerification,
  phoneNumber,
  error,
  loading,
  resetForm,
}: Step1Props) {
  if (step !== 1) return null;

  const initialValues = {
    verificationCode: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleVerification}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form className="space-y-6">
          <div>
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Verification Code
            </label>
            <Field
              id="verificationCode"
              name="verificationCode"
              type="text"
              value={values.verificationCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                setFieldValue("verificationCode", value);
              }}
              placeholder="123456"
              className={`w-full px-4 py-3 border ${
                errors.verificationCode && touched.verificationCode
                  ? "border-red-300"
                  : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest`}
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
            {errors.verificationCode && touched.verificationCode && (
              <p className="text-red-500 text-xs mt-1">
                {errors.verificationCode}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || values.verificationCode.length !== 6}
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
        </Form>
      )}
    </Formik>
  );
}

export default Step1;
