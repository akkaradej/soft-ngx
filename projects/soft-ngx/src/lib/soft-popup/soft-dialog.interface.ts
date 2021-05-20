import { Observable } from 'rxjs';
import { SoftPopup } from './soft-popup.component';

export interface SoftDialog {
  data: any;
  isAnimated: boolean;
  backdropAnimations?: any;
  cardAnimations?: any;
  result$: Observable<SoftPopup>;
  dispose: () => void;
}
