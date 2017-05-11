import { Injectable } from '@angular/core';

@Injectable()

export class MatrixService {

  private cellSize = 16;
  private height = 30;
  private width = 30;

  private matrix = [];

  constructor() {
    this.matrix = this.randomMatrix();
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
    return this.cloneMatrix(this.matrix);
  }

  randomMatrix(): number[][] {
    let matrix = [];
    for(let x = 0; x < this.width; x++) {
      matrix[x] = []
      for(let y = 0; y < this.height; y++) {
        matrix[x][y] = Math.round(Math.random()); 
      }
    }
    return this.cloneMatrix(matrix);
  }

  emptyMatrix(): number[][] {
    let matrix = [];
    for(let x = 0; x < this.width; x++) {
      matrix[x] = []
      for(let y = 0; y < this.height; y++) {
        matrix[x][y] = 0; 
      }
    }
    return this.cloneMatrix(matrix);
  }

  cloneMatrix(matrix: number[][]): number[][] {
    return JSON.parse(JSON.stringify(matrix));
  }

}
