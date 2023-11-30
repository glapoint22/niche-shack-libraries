import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupContainerComponent } from './popup-container.component';

describe('PopupContainerComponent', () => {
  let component: PopupContainerComponent;
  let fixture: ComponentFixture<PopupContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PopupContainerComponent]
    });
    fixture = TestBed.createComponent(PopupContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
