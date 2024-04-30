import { Component, OnInit } from '@angular/core';
import { DragAndDropList, Element } from '../../models/test-element';

import * as Actions from '../../../solitaire/store/solitaire.action';
import { Card, CardFace, CardNumber, CardSuit } from '../../models/card';
import { AppState } from '../../../state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-card-test',
  templateUrl: './card-test.component.html',
  styleUrl: './card-test.component.scss'
})
export class CardTestComponent implements OnInit {

  containerArray: DragAndDropList[] = [];
  draggedElement: Element | null | undefined;

  constructor(private store: Store<AppState>) {
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

    this.store.subscribe((state) => {
      if (state) {
        console.log(state.solitaireState.deck);
      }
    })
      
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

  clickedInit() {
    this.store.dispatch(Actions.initializeDeck());
  }

  clickedSwap() {
    this.store.dispatch(Actions.swapDeckElements({index1: 2, index2: 4}))
  }

  clickedShuffle() {
    this.store.dispatch(Actions.shuffleDeck());
  }
}
