import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarUserListComponent } from './car-user-list.component';

describe('CarUserListComponent', () => {
  let component: CarUserListComponent;
  let fixture: ComponentFixture<CarUserListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarUserListComponent]
    });
    fixture = TestBed.createComponent(CarUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
