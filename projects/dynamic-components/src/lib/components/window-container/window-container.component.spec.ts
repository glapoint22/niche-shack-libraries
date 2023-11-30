import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowContainerComponent } from './window-container.component';

describe('WindowContainerComponent', () => {
  let component: WindowContainerComponent;
  let fixture: ComponentFixture<WindowContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WindowContainerComponent]
    });
    fixture = TestBed.createComponent(WindowContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
