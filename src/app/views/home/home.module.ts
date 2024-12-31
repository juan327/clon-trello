import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { HomeComponent } from './home.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';

//#region PRIMENG
//#endregion

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    //HomeRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    DialogModule,
    InputTextareaModule,
    DragDropModule,
    
    //#region PRIMENG IMPORTS
    ButtonModule,
    //#endregion
  ],
})
export class HomeModule { }
