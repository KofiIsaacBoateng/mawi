export const URL = "http://192.168.43.14:5000/api/v1";

// auth
export const LOGIN = `${URL}/auth/login`;
export const REGISTER = `${URL}/auth/register`;

// services
export const SERVICE_FEED = (service, lnglat) =>
  `${URL}/services/service/${service || "none"}/within/${lnglat.join(",")}`;
