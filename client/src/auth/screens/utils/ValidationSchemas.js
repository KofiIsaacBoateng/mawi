import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string("Email must be of type string")
    .email("Invalid email!")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required!")
    .min(8, "Password must be at least 8 characters"),
});

export const registrationValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name cannot be less than 3 characters"),

  email: yup
    .string("Email must be of type string")
    .email("Invalid email!")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required!")
    .min(8, "Password must be at least 8 characters"),

  role: yup
    .string()
    .required("Forgot to add a selected role by the user!")
    .oneOf(["service-provider", "customer"], "Role must be of two types."),
  title: yup.string().required("Please provide a title."),
  about: yup
    .string()
    .required("Please provide a brief statement about yourself!"),
});

export const registrationValidationSchemaForCustomer = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name cannot be less than 3 characters"),

  email: yup
    .string("Email must be of type string")
    .email("Invalid email!")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required!")
    .min(8, "Password must be at least 8 characters"),

  role: yup
    .string()
    .required("Forgot to add a selected role by the user!")
    .oneOf(["service-provider", "customer"], "Role must be of two types."),
});
