import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Web } from './web';

describe('Web', () => {
  let component: Web;
  let fixture: ComponentFixture<Web>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Web]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Web);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
