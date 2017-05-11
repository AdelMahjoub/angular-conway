import { GameService } from './game.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { MatrixService } from './matrix.service';
import { CellComponent } from './board/cell/cell.component';
import { ContolBarComponent } from './contol-bar/contol-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CellComponent,
    ContolBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [MatrixService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
