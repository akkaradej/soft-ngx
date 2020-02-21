import { HttpErrorResponse } from '@angular/common/http';

export interface SoftApiError extends HttpErrorResponse {
  ignoreGlobalErrorAlert: () => void;
}

export interface SoftApiErrorHandler {
  title?: string;
  message?: string;
  colorVar?: string;
  agreeText?: string;
}
