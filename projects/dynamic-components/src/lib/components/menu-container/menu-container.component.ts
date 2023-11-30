import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { DynamicComponentContainer } from '../../models/dynamic-component-container';

@Component({
  selector: 'ns-menu-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-container.component.html'
})
export class MenuContainerComponent extends DynamicComponentContainer<MenuComponent> {
  protected override zLevel: number = 10000;

  protected override initializeComponent(component: MenuComponent): void {
    super.initializeComponent(component);

    this.components.forEach((menuComponent: MenuComponent) => {
      if (menuComponent != component) menuComponent.close();
    });
  }

  protected override onMousedown(): void {
    this.components[this.components.length - 1].close();
  }
}