import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SoftApiError } from './soft-api-error.model';

@Injectable({
  providedIn: 'root',
})
export class SoftApiErrorHandlerService {

  forceHandleError(err: SoftApiError): void {   
  }
  
  handleError(err: HttpErrorResponse): void {
  }
}