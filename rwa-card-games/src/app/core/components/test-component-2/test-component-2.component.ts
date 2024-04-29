import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/product';

@Component({
  selector: 'app-test-component-2',
  templateUrl: './test-component-2.component.html',
  styleUrl: './test-component-2.component.scss'
})
export class TestComponent2Component implements OnInit{
  availableProducts: Product[] | undefined;
  selectedProducts: Product[] | undefined;

  draggedProduct: Product | undefined | null;

  constructor() {

  }

  ngOnInit(): void {
    this.selectedProducts = [];
    this.availableProducts = [
      {id: '1', name: 'Black watch'},
      {id: '2', name: 'Bamboo watch'}
    ]
  }

  dragStart(product: Product) {
    this.draggedProduct = product;
  }

  drop() {
    if (this.draggedProduct) {
      let draggedProductIndex = this.findIndex(this.draggedProduct);
      this.selectedProducts = [...(this.selectedProducts as Product[]), this.draggedProduct];
      this.availableProducts = this.availableProducts?.filter((val, i) => i != draggedProductIndex);
      this.draggedProduct = null;

    }
  }

  dragEnd() {
    this.draggedProduct = null;
  }

  findIndex(product: Product) {
    let index = -1;
    for (let i = 0; i < (this.availableProducts as Product[]).length; i++) {
      if (product.id === (this.availableProducts as Product[])[i].id) {
        index = i;
        break;
      }
    }
    return index;
  }
}
