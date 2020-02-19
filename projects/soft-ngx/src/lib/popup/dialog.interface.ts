import { Observable } from 'rxjs';

export interface Dialog {
  data: any;
  result$: Observable<boolean>;
}
