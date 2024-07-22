export const URL = "http://192.168.43.14:5000/api/v1";

// auth
export const LOGIN = `${URL}/auth/login`;
export const REGISTER = `${URL}/auth/register`;

// services
export const SERVICE_FEED = (service, lnglat) =>
  `${URL}/services/service/${service || "none"}/within/${lnglat.join(",")}`;

// servicer feed
export const SERVICER_FEED = `${URL}/work`; // GET - param:id [accepted | pending | completed]
export const COMPLETE_WORK = `${URL}/work/complete`; // PATCH - param:id

// hires
export const SEND_HIRE_REQUEST = `${URL}/work/send`; // POST
export const REJECT_HIRE_REQUEST = `${URL}/work/reject`; // PATCH - param:id
export const ACCEPT_HIRE_REQUEST = `${URL}/work/accept`; // PATCH - param:id

// conversations
export const GET_ALL_CONVERSATIONS = `${URL}/work/messaging/convos`; // GET - param:role
export const GET_CONVERSATION = `${URL}/work/messaging/convo`; // GET - param:id
export const SEND_MESSAGE = `${URL}/work/messaging/send-message`; // POST - param:id
