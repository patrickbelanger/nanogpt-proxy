export interface ConfigurationTypes {
  forgetPassword: boolean;
  registration: boolean;
  reviewPendingRegistration: boolean;
}

export const DEFAULT_NANOGPT_CONFIG: ConfigurationTypes = {
  forgetPassword: false,
  registration: true,
  reviewPendingRegistration: true,
};
