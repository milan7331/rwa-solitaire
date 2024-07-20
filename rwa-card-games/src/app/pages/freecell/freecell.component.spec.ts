import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellComponent } from './freecell.component';

describe('FreecellComponent', () => {
  let component: FreecellComponent;
  let fixture: ComponentFixture<FreecellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreecellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FreecellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
