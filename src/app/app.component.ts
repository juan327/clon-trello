import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { localstorageService } from './_services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'trello';
  
  constructor(public localstorageService: localstorageService) {
  }

  ngOnInit(): void {
    this.localstorageService.init();
  }

  ngAfterViewInit() {
  }

}
