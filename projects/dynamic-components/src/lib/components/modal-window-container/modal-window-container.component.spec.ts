import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWindowContainerComponent } from './modal-window-container.component';

describe('ModalWindowContainerComponent', () => {
  let component: ModalWindowContainerComponent;
  let fixture: ComponentFixture<ModalWindowContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalWindowContainerComponent]
    });
    fixture = TestBed.createComponent(ModalWindowContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
