import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnSubmitPage } from './return-submit.page';

describe('ReturnSubmitPage', () => {
  let component: ReturnSubmitPage;
  let fixture: ComponentFixture<ReturnSubmitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnSubmitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnSubmitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
