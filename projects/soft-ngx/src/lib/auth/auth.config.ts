export interface AuthServiceConfig {
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

export interface AuthInterceptorConfig {
  autoRefreshToken?: boolean;
  loginScreenUrl?: string;
}

export interface CustomAuthRequestKey {
  username: string;
  password: string;
  refresh_token?: string;
}

export interface CustomAuthResponseKey {
  access_token: string;
  refresh_token?: string;
  expires_in?: string;
  scope?: string;
}
