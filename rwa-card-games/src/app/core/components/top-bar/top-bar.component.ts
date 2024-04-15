import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {

  items: MenuItem[] | undefined;
  constructor() {

  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Delete',
        icon: 'pi pi-times'
      },
    ]
  }

}
