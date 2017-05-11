import { GameService } from './../game.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-contol-bar',
  templateUrl: './contol-bar.component.html',
  styleUrls: ['./contol-bar.component.css']
})
export class ContolBarComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService) { }

  gameStarted = false;

  ngOnInit() {
    this.gameService.gameRunStatus.subscribe(
      (state: boolean) => {
        this.gameStarted = state;
      }
    )
  }

  ngOnDestroy() {
    this.gameService.gameRunStatus.unsubscribe();
  }

  onRandom() {
    this.gameService.gameActions.next('RANDOM');
  }

  onStart() {
    this.gameService.gameActions.next('START');
    this.gameService.gameRunStatus.next(true);
  }

  onClear() {
    this.gameService.gameActions.next('CLEAR');
  }

  onStop() {
    this.gameService.gameActions.next('STOP');
    this.gameService.gameRunStatus.next(false);
  }

}
