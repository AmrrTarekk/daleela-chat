import * as Yup from "yup";

export const validationStep1 = Yup.object().shape({
  verificationCode: Yup.string()
    .required("Verification code is required")
    .matches(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

export const validationStep0 = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(
      /^(\+20|0)?1[0125][0-9]{8}$/,
      "Please enter a valid Egyptian phone number"
    )
    .required("Phone number is required"),
});
