import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError extends HttpErrorResponse {
  ignoreGlobalErrorAlert: Function;
}
