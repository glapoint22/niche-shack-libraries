import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from '../../models/content-component';
import { DynamicComponentContainer } from '../../models/dynamic-component-container';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'ns-popup-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-container.component.html'
})
export class PopupContainerComponent<T extends ContentComponent> extends DynamicComponentContainer<PopupComponent<T>> {
  protected override zLevel: number = 100;

  protected override initializeComponent(component: PopupComponent<T>): void {
    if (this.components.length > 0) {
      this.components[this.components.length - 1].close();
    }

    super.initializeComponent(component);
  }


  protected override onMousedown(): void {
    this.components[this.components.length - 1].close();
  }
}