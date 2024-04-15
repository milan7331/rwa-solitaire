import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss'
})
export class DockComponent implements OnInit{

  items: MenuItem[] | undefined;
  
  position: any = 'bottom';

  positionOptions: any[] = [
    {
      label: 'Bottom',
      value: 'bottom'
    },
    {
      label: 'Top',
      value: 'top'
    },
    {
      label: 'Left',
      value: 'left'
    },
    {
      label: 'Right',
      value: 'right'
    }
  ];

  constructor() {
    this.items = [
      {
        label: 'Finder',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg'
      },
      {
        label: 'App Store',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg'
      },
      {
        label: 'Photos',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg'
      },
      {
        label: 'Trash',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png'
      }

    ]
  }

  ngOnInit(): void {


  }


}
