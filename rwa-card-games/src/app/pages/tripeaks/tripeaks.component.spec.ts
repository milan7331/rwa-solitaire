import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripeaksComponent } from './tripeaks.component';

describe('TripeaksComponent', () => {
  let component: TripeaksComponent;
  let fixture: ComponentFixture<TripeaksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripeaksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripeaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
