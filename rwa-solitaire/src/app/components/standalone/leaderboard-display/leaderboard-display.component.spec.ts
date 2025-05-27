import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardDisplayComponent } from './leaderboard-display.component';

describe('LeaderboardDisplayComponent', () => {
  let component: LeaderboardDisplayComponent;
  let fixture: ComponentFixture<LeaderboardDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
