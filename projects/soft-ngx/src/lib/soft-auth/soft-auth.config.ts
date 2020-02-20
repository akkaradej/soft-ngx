export interface SoftAuthServiceConfig {
  // auth service
  authenticationScheme?: string;
  tokenUrl: string;
  refreshTokenUrl?: string;
  isFormData: boolean;
  isJWT: boolean;
  isOAuth: boolean; // if true, it will be force isFormData = true
  scope?: string;
  clientId?: string;
}

export interface SoftAuthInterceptorConfig {
  autoRefreshToken?: boolean;
  loginScreenUrl?: string;
  forceSendToken?: boolean;
}

export interface SoftAuthRequestKey {
  username: string;
  password: string;
  refresh_token?: string;
}

export interface SoftAuthResponseKey {
  access_token: string;
  refresh_token?: string;
  expires_in?: string;
  scope?: string;
}
