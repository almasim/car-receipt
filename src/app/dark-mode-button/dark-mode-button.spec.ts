import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkModeButton } from './dark-mode-button';

describe('DarkModeButton', () => {
  let component: DarkModeButton;
  let fixture: ComponentFixture<DarkModeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkModeButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkModeButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
