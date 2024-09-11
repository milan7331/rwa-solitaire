import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGameConfirmationComponent } from './new-game-confirmation.component';

describe('NewGameConfirmationComponent', () => {
  let component: NewGameConfirmationComponent;
  let fixture: ComponentFixture<NewGameConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewGameConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewGameConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
