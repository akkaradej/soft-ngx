export interface AuthConfig {
  authApiUrl: string;
  authAdditionalData?: string[];
  authenticationScheme?: string;
  hasRefreshToken?: boolean;
  loginScreenUrl?: string;
}

export const defaultConfig = {
  authAdditionalData: <string[]>[],
  authenticationScheme: 'Bearer',
  hasRefreshToken: true,
  loginScreenUrl: '/',
};
