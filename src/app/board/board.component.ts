import { GameService } from './../game.service';
import { MatrixService } from './../matrix.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  width: number;
  height: number;
  cellSize: number;
  board = [];

  throttle: number;

  boradStyleSize: {
    width: string;
    height: string;
  }

  timerID: any;
  cycles = 0;

  gameSubscription: Subscription;

  speedSubscription: Subscription;

  constructor(
    private matrixService: MatrixService,
    private gameService: GameService) { }

  ngOnInit() {

    this.width = this.matrixService.getWidth();
    this.height = this.matrixService.getHeight();
    this.cellSize = this.matrixService.getCellSize();
    this.throttle = this.gameService.throttle;
    
    this.boradStyleSize = {
      width: `${this.width * this.cellSize + 1}px`,
      height: `${this.height * this.cellSize + 1}px`,
    }

    for(let x = 0; x < this.width; x++) {
      this.board[x] = [];
      for(let y = 0; y < this.height; y++) {
        this.board[x][y] = 0;
      }
    }
      
    this.gameSubscription = this.gameService.gameActions.subscribe(
      (action: string) => {
        switch(action) {
          case 'START':
            if(!this.timerID) this.animateBoard();
            break;
          case 'STOP':
            if(this.timerID) this.stopAnimation();
            break;
          case 'CLEAR':
            if(!this.timerID) {
              this.cycles = 0;
              this.matrixService.emptyMatrix();
              this.matrixService.matrixChanged.next(true);
              this.matrixService.liveCellsCount.next(this.matrixService.countLiveCells());
              this.matrixService.cyclesCount.next(this.cycles);
            };
            break;
          case 'RANDOM':
            if(!this.timerID) {
              this.cycles = 0;
              this.matrixService.randomMatrix();
              this.matrixService.matrixChanged.next(true);
              this.matrixService.liveCellsCount.next(this.matrixService.countLiveCells());
              this.matrixService.cyclesCount.next(this.cycles);
            };
          default:
        }
      }
    )

    this.speedSubscription = this.gameService.gameSpeedChanged.subscribe(
      (throttle: number) => {
        this.throttle = throttle;
      }
    )

    this.matrixService.liveCellsCount.next(this.matrixService.countLiveCells());
  }

  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
    this.speedSubscription.unsubscribe();
  }

  getNeighbours(posX: number, posY: number, matrix: number[][]): number {
    let neighbours = [];
    for(let x = posX - 1; x <= (posX + 1); x++) {
      for(let y = posY - 1; y <= (posY + 1); y++) {
        if((x >= 0 && y >= 0) && (x !== posX || y !== posY) && (x < this.width && y < this.height)) {
          neighbours.push(matrix[x][y]);
        }
      }
    }
    return neighbours.reduce((a, b) => a + b, 0);
  }

  nextCycle(): void {
    let nextMatrix: number[][];
    let currentMatrix = this.matrixService.getMatrix()
    nextMatrix = this.matrixService.cloneMatrix(currentMatrix);

    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        let currentCell = currentMatrix[x][y];
        let cellFate = this.getNeighbours(x, y, currentMatrix)
        switch(currentCell) {
          case 1:
            if(cellFate < 2 || cellFate > 3) nextMatrix[x][y] = 0;
            break;
          case 0:
            if(cellFate === 3) nextMatrix[x][y] = 1;
            break;
          default:
        }
      }
    }
    let newCycle = currentMatrix.toString() !== nextMatrix.toString();
    if(newCycle) {
      this.cycles++;
      this.matrixService.updateMatrix(nextMatrix);
      this.matrixService.matrixChanged.next(true);
      this.matrixService.liveCellsCount.next(this.matrixService.countLiveCells());
      this.matrixService.cyclesCount.next(this.cycles);
    } else {
      this.cycles = 0;
      if(this.timerID) {
        this.stopAnimation();
        this.gameService.gameRunStatus.next(false);
      }
    }
  }

  animateBoard(): void {
    this.timerID = requestAnimationFrame(() => {
      this.animateBoard();
    });
    this.throttle--;
    if(this.throttle <= 0) {
       this.nextCycle();
       this.throttle = this.gameService.throttle;
    }
   
  }

  stopAnimation(): void {
    cancelAnimationFrame(this.timerID);
    this.timerID = null;
  }


}
