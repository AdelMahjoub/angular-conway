import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()

export class MatrixService {

  private cellSize = 16;
  private height = 30;
  private width = 40;

  private matrix = [];

  matrixChanged = new Subject<boolean>();

  liveCellsCount = new Subject<number>();

  cyclesCount = new Subject<number>();

  constructor() {
    this.randomMatrix();
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getCellSize(): number {
    return this.cellSize;
  }

  getMatrix(): number[][] {
    return this.matrix;
  }

  getValue(x: number, y: number): number {
    return this.matrix[x][y];
  }

  toggleValue(x: number, y: number): void {
    this.matrix[x][y] = Math.abs(this.matrix[x][y] - 1);
  }

  updateMatrix(matrix: number[][]) {
    this.matrix = this.cloneMatrix(matrix);
  }

  randomMatrix(): void {
    for(let x = 0; x < this.width; x++) {
      this.matrix[x] = [];
      for(let y = 0; y < this.height; y++) {
       this.matrix[x][y] = Math.round(Math.random()); 
      }
    }
  }

  emptyMatrix(): void {
    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        this.matrix[x][y] = 0;
      }
    }
  }

  countLiveCells(): number {
    let flattenedMatrix = [];
    flattenedMatrix = this.matrix.reduce((acc, cur) => acc.concat(cur), []);
    return flattenedMatrix.reduce((acc, cur) => acc + cur, 0);
  }

  cloneMatrix(matrix: number[][]): number[][] {
    return JSON.parse(JSON.stringify(matrix));
  }

}
