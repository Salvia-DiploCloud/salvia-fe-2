/**
 * Hardcoded configuration (no .env.local required)
 */
export const config = {
  cognito: {
    userPoolId: "us-east-1_15vFB45j4",
    clientId: "4dekf31epl7lldimlhgf081h23",
  },
  ticketsBackendUrl: "http://salvia-tickets-alb-2009672436.us-east-1.elb.amazonaws.com",
  medicalFilesBackendUrl: "https://p9jcp19fe8.execute-api.us-east-1.amazonaws.com/dev",
} as const
