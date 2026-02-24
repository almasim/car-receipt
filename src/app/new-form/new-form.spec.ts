import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewForm } from './new-form';

describe('NewForm', () => {
  let component: NewForm;
  let fixture: ComponentFixture<NewForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
