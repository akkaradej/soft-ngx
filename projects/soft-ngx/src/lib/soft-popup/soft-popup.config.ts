export interface SoftPopupConfig {
  // general
  isAgreeFirst?: boolean;
  agreeText?: string;
  disagreeText?: string;
  // alert
  alertAgreeText?: string;
  alertColorVar?: string;
  // confirm
  confirmColorVar?: string;
  // delete
  deleteTitleFunc?: (itemName: string) => string;
  deleteMessageFunc?: (itemName: string) => string;
  deleteColorVar?: string;
  // animations
  isAnimated?: boolean;
  backdropAnimations?: {
    voidOpacity?: number;
    openOpacity?: number;
    closedOpacity?: number;
    openAnimate?: string;
    closedAnimate?: string;
  };
  cardAnimations?: {
    voidOpacity?: number;
    voidTransform?: string;
    openOpacity?: number;
    openTransform?: string;
    closedOpacity?: number;
    closedTransform?: string;
    openAnimate?: string;
    closedAnimate?: string;
  };
}

export const defaultConfig = {
  // general
  isAgreeFirst: true,
  agreeText: 'Yes',
  disagreeText: 'No',
  // alert
  alertAgreeText: 'OK',
  alertColorVar: 'primary',
  // confirm
  confirmColorVar: 'primary',
  // delete
  deleteTitleFunc: (itemName: string) => {
    return `Confirm Deletion`;
  },
  deleteMessageFunc: (itemName: string) => {
    return `Are you sure you want to delete "${itemName}"?`;
  },
  deleteColorVar: 'danger',
  isAnimated: true,
};
