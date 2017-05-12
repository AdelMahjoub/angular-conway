import { Subscription } from 'rxjs/Subscription';
import { GameService } from './../game.service';
import { MatrixService } from './../matrix.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cells-monitor',
  templateUrl: './cells-monitor.component.html',
  styleUrls: ['./cells-monitor.component.css']
})
export class CellsMonitorComponent implements OnInit, OnDestroy {

  liveCells: number;

  cycles = 0;

  frames: number;

  liveCellsSubscription: Subscription;
  cyclesSubscription: Subscription;
  gameSpeedSubscription: Subscription;

  constructor(
    private matrixService: MatrixService,
    private gameService: GameService) { }

  ngOnInit() {

    this.liveCells = this.matrixService.countLiveCells();

    if(this.gameService.throttle > 0) {
      this.frames = +(60 / this.gameService.throttle).toPrecision(2);
    } else {
      this.frames = 60;
    }

    this.liveCellsSubscription = this.matrixService.liveCellsCount.subscribe(
      (liveCellsCount: number) => {
        this.liveCells = liveCellsCount;
      }
    )

    this.cyclesSubscription = this.matrixService.cyclesCount.subscribe(
      (cycles: number) => {
        this.cycles = cycles;
      }
    )

    this.gameSpeedSubscription = this.gameService.gameSpeedChanged.subscribe(
      (throttle: number) => {
        if(throttle > 0) {
          this.frames = +(60 / throttle).toPrecision(2);
        } else {
          this.frames = 60;
        }
      }
    )
  }

  ngOnDestroy() {
    this.liveCellsSubscription.unsubscribe();
  }

}
