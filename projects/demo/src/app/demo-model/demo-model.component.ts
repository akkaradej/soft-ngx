import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-model',
  templateUrl: './demo-model.component.html',
  styleUrls: ['./demo-model.component.scss']
})
export class DemoModelComponent implements OnInit {
  selectedDate = new Date();

  items = [{ id: 1, name: 'item 1' }, { id: 2, name: 'item 2' }, { id: 3, name: 'item 3' }];
  selectedItem = { id: 2, whatever: 'just matched with id' };

  file: any;

  constructor() { }

  ngOnInit() {
  }

}
