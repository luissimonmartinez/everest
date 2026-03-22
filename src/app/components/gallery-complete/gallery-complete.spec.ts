import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryComplete } from './gallery-complete';

describe('GalleryComplete', () => {
  let component: GalleryComplete;
  let fixture: ComponentFixture<GalleryComplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryComplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
