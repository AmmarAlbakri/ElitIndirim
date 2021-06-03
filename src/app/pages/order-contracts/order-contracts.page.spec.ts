import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderContractsPage } from './order-contracts.page';

describe('OrderContractsPage', () => {
  let component: OrderContractsPage;
  let fixture: ComponentFixture<OrderContractsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderContractsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderContractsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
