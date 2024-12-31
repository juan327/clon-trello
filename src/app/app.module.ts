import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { CdkDrag, CdkDropList, CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop';

//#region PRIMENG
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
//#endregion

//#region CUSTOMS
//#endregion


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [

    CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    
    //#region PRIMENG IMPORTS
    ButtonModule,
    ConfirmDialogModule,
    //#endregion
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    MessageService, DatePipe, ConfirmationService, provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
