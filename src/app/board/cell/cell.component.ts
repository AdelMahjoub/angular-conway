import { Subscription } from 'rxjs/Subscription';
import { GameService } from './../../game.service';
import { MatrixService } from './../../matrix.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit, OnDestroy {

  allowToggle = true;
  cellValue: number;
  @Input() positionX: number;
  @Input() positionY: number;
  @Input() size: number;

  cellStyle: {
    top: string;
    left: string;
    width: string;
    height: string;
  }

  matrixServiceSubscription: Subscription;
  gameServiceSubscription: Subscription;

  constructor(
    private matrixService: MatrixService,
    private gameService: GameService) { }

  ngOnInit() {
    
    this.cellStyle = {
      top: `${this.size * this.positionY}px`,
      left: `${this.size * this.positionX}px`,
      width: `${this.size}px`,
      height: `${this.size}px`,
    }
    
    this.cellValue = this.matrixService.getMatrix()[this.positionX][this.positionY];

    this.matrixServiceSubscription = this.matrixService.matrixChanged.subscribe(
      (changed: boolean) => {
        if(changed) {
          this.cellValue = this.matrixService.getMatrix()[this.positionX][this.positionY];
        }
      }
    )

    this.gameServiceSubscription = this.gameService.gameRunStatus.subscribe(
      (gameStarted: boolean) => {
        this.allowToggle = !gameStarted;
      }
    )
  }

  ngOnDestroy() {
    this.matrixServiceSubscription.unsubscribe();
    this.gameServiceSubscription.unsubscribe();
  }

  onToggle() {
    if(this.allowToggle) {
      this.matrixService.toggleValue(this.positionX, this.positionY);
      this.matrixService.matrixChanged.next(true);
    }
  }

}
