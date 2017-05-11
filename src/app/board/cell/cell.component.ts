import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input() cellValue: number;
  @Input() positionX: number;
  @Input() positionY: number;
  @Input() size: number;

  cellStyle: {
    top: string;
    left: string;
    width: string;
    height: string;
  }

  constructor() { }

  ngOnInit() {
    if(!this.cellStyle) {
      this.cellStyle = {
        top: `${this.size * this.positionY}px`,
        left: `${this.size * this.positionX}px`,
        width: `${this.size}px`,
        height: `${this.size}px`,
      }
    }
  }

}
