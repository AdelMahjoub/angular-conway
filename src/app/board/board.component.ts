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
  board: number[][];

  boardHistory = [];

  boradStyleSize: {
    width: string;
    height: string;
  }

  timerID: any;

  gameSubscription: Subscription;

  constructor(
    private matrixService: MatrixService,
    private gameService: GameService) { }

  ngOnInit() {
    
    if(!this.width && !this.height && !this.cellSize) {
      this.width = this.matrixService.getWidth();
      this.height = this.matrixService.getHeight();
      this.cellSize = this.matrixService.getCellSize();
      this.boradStyleSize = {
        width: `${this.width * this.cellSize}px`,
        height: `${this.height * this.cellSize}px`,
      }
    }

    if(!this.board) this.board = this.matrixService.getMatrix();
      
    this.gameSubscription = this.gameService.gameSubject.subscribe(
      (action: string) => {
        switch(action) {
          case 'START':
            if(!this.timerID) this.animateBoard();
            break;
          case 'STOP':
            if(this.timerID) this.stopAnimation();
            break;
          case 'CLEAR':
            if(!this.timerID) this.board = this.matrixService.emptyMatrix();
            break;
          case 'RANDOM':
            if(!this.timerID) this.board = this.matrixService.randomMatrix();
          default:
        }
      }
    )
  } 

  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
    if(this.timerID) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
  }

  /**
   * Return the sum of all adjacent cells of at a given position (posX, posY)
   * @param posX 
   * @param posY 
   * @param matrix 
   */
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

  /**
   * Apply Conway logic to all cells
   */
  nextCycle(): void {
    let nextMatrix: number[][];
    nextMatrix = this.matrixService.cloneMatrix(this.board);

    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        let currentCell = this.board[x][y];
        let cellFate = this.getNeighbours(x, y, this.board)
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
    // this.boardHistory.push(this.matrixService.cloneMatrix(this.board));
    this.board = this.matrixService.cloneMatrix(nextMatrix);
  }

  animateBoard(): void {
    this.timerID = setInterval(() => {
      this.nextCycle();
    }, 33)
  }

  stopAnimation(): void {
    clearInterval(this.timerID);
    this.timerID = null;
  }


}
