import { Observable } from 'rxjs';

export interface SoftDialog {
  data: any;
  result$: Observable<boolean>;
}
