import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class GameService {

  gameActions = new Subject<string>();

  gameRunStatus = new Subject<boolean>();

  constructor() { }

}