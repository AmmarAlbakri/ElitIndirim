import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageModelPage } from './image-model.page';

describe('ImageModelPage', () => {
  let component: ImageModelPage;
  let fixture: ComponentFixture<ImageModelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageModelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
