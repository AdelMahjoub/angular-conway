import { MatrixService } from './../../matrix.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

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

  constructor(private matrixService: MatrixService) { }

  ngOnInit() {
    if(!this.cellStyle) {
      this.cellStyle = {
        top: `${this.size * this.positionY}px`,
        left: `${this.size * this.positionX}px`,
        width: `${this.size}px`,
        height: `${this.size}px`,
      }
    }
    this.cellValue = this.matrixService.getMatrix()[this.positionX][this.positionY];
    this.matrixService.matrixChanged.subscribe(
      (changed: boolean) => {
        if(changed) {
          this.cellValue = this.matrixService.getMatrix()[this.positionX][this.positionY];
        }
      }
    )
  }

}
