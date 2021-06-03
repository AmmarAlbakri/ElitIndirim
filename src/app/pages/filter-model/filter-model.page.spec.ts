import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterModelPage } from './filter-model.page';

describe('FilterModelPage', () => {
  let component: FilterModelPage;
  let fixture: ComponentFixture<FilterModelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterModelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
