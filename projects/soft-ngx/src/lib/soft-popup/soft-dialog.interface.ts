import { Observable } from 'rxjs';

export interface SoftDialog {
  data: any;
  isAnimated: boolean;
  backdropAnimations?: any;
  cardAnimations?: any;
  result$: Observable<boolean>;
}
