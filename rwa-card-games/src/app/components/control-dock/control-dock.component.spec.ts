import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDockComponent } from './control-dock.component';

describe('ControlDockComponent', () => {
  let component: ControlDockComponent;
  let fixture: ComponentFixture<ControlDockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlDockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
