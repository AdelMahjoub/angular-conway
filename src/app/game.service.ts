import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class GameService {

  throttle = 5;

  gameActions = new Subject<string>();

  gameRunStatus = new Subject<boolean>();

  gameSpeedChanged = new Subject<number>();

  constructor() { }

  sppedUp() {
    let newThrottle = this.throttle - 1;
    this.throttle = Math.max(0, newThrottle);
  }

  speedDown() {
    let newThrottle = this.throttle + 1;
    this.throttle = Math.min(12, newThrottle);
  }

}
