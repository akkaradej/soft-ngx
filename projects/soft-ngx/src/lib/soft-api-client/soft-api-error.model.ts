import { HttpErrorResponse } from '@angular/common/http';

export interface SoftApiError extends HttpErrorResponse {
  ignoreErrorHandler: () => void;
}
