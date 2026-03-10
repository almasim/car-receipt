import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiePopup } from './cookie-popup';

describe('CookiePopup', () => {
  let component: CookiePopup;
  let fixture: ComponentFixture<CookiePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiePopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
