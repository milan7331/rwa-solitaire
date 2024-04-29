import { Component, OnInit } from '@angular/core';
import { DragAndDropList, Element } from '../../models/test-element';

import { Card, CardFace, CardNumber, CardSuit } from '../../models/card';

@Component({
  selector: 'app-card-test',
  templateUrl: './card-test.component.html',
  styleUrl: './card-test.component.scss'
})
export class CardTestComponent implements OnInit {

  containerArray: DragAndDropList[] = [];
  draggedElement: Element | null | undefined;

  constructor() {
    this.containerArray = [
      {id : "left", elements : []} as DragAndDropList,
      {id : "right", elements : []} as DragAndDropList
    ];
  }

  ngOnInit(): void {
      this.containerArray[0].elements.push({listId: this.containerArray[0].id, value: "Element1"});
      this.containerArray[0].elements.push({listId: this.containerArray[0].id, value: "Element2"});
      this.containerArray[0].elements.push({listId: this.containerArray[0].id, value: "Element3"});
      this.containerArray[0].elements.push({listId: this.containerArray[0].id, value: "Element4"});
      this.containerArray[0].elements.push({listId: this.containerArray[0].id, value: "Element5"});
  }

  dragStart(el: Element) {
    this.draggedElement = el;
  }

  dragEnd() {
    this.draggedElement = null;
  }

  drop(destList: DragAndDropList) {
    if (this.draggedElement) {
      let draggedElementIndex:number = this.findIndex(this.draggedElement);
      let cpyElement: Element = { ...this.draggedElement };

      let srcArray: Element[] = this.containerArray.find(arr => arr.id === this.draggedElement!.listId)!.elements;
      srcArray.splice(draggedElementIndex, 1);

      cpyElement.listId = destList.id;

      destList.elements.push(cpyElement);
      
      this.draggedElement = null;
    }
  }

  findIndex(el: Element) {
    let index: number = -1;
    let list = this.containerArray.find(arr => arr.id === el.listId);
    if (list) {
      let arr = list.elements;
      for (let i = 0; i < arr.length; i++) {
        if (el.value === arr[i].value) {
          index = i;
          break;
        }
      }
    }
    return index;
  }
}
