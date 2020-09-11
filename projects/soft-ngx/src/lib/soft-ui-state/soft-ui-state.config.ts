export interface SoftUIStateConfig {
  minDuration?: number;
}

export interface SoftBusyConfig {
  busyDelay?: number;
  busyHTML?: string;
}

export const defaultBusyConfig: SoftBusyConfig = {
  busyDelay: 400,
  busyHTML: `
    <div class="busy-spinner">
      <div class="ng-busy">
        <div class="ng-busy-default-wrapper">
          <div class="ng-busy-default-sign">
            <div class="ng-busy-default-spinner">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
                <div class="bar4"></div>
                <div class="bar5"></div>
                <div class="bar6"></div>
                <div class="bar7"></div>
                <div class="bar8"></div>
                <div class="bar9"></div>
                <div class="bar10"></div>
                <div class="bar11"></div>
                <div class="bar12"></div>
            </div>
            <div class="ng-busy-default-text">Please wait...</div>
          </div>
        </div>
      </div>
      <div class="ng-busy-backdrop">
      </div>
    </div>
  `,
};
