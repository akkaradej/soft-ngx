import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-model-helper-module',
  templateUrl: './model-helper-module.component.html',
  styleUrls: ['./model-helper-module.component.scss']
})
export class ModelHelperModuleComponent implements OnInit {
  selectedDate = new Date();

  items = [{ id: 1, name: 'item 1' }, { id: 2, name: 'item 2' }, { id: 3, name: 'item 3' }];
  selectedItem = { id: 2, whatever: 'just matched with id' };

  file: any;

  constructor() { }

  ngOnInit() {
  }

}
