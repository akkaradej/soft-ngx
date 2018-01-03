import { HttpErrorResponse } from '@angular/common/http';

export class ApiError extends HttpErrorResponse {
  ignoreGlobalErrorAlert: Function;
}
