import { Auth as AuthBaseType } from 'soft-ngx';

export interface Auth extends AuthBaseType {
  is_admin: boolean;
  user_id: number;
  display_name: string;
}