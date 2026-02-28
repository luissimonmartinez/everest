import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAdmin } from './contact-admin';

describe('ContactAdmin', () => {
  let component: ContactAdmin;
  let fixture: ComponentFixture<ContactAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
