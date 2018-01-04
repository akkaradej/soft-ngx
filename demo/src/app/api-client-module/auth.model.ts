import { Auth } from 'soft-ngx';

export interface Auth extends Auth {
  is_admin: boolean;
  user_id: number;
  display_name: string;
}