import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrl: './test-component.component.scss'
})
export class TestComponentComponent {
  @Input() sidebarVisible: boolean = false;
}
