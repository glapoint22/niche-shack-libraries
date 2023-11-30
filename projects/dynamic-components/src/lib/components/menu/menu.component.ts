import { Component, ElementRef, HostListener, Renderer2, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponent } from '../../models/dynamic-component';
import { IMenuComponent } from '../../interfaces/i-menu-component';
import { Menu } from '../../models/menu';
import { IMenu } from '../../interfaces/i-menu';
import { Position } from '../../models/position';
import { take } from 'rxjs';
import { Rect } from '../../models/rect';
import { MenuItem } from '../../models/menu-item';

@Component({
  selector: 'ns-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent extends DynamicComponent implements IMenuComponent {
  @ViewChild('menuBaseElement') private menuBaseElement!: ElementRef<HTMLElement>;
  private renderer: Renderer2 = inject(Renderer2);
  public menu!: Menu;


  public init(menu: IMenu, position: Position): void {
    this.menu = menu as Menu;

    this.onOpen
      .pipe(take(1))
      .subscribe(() => this.setPosition(position));
  }




  public setPosition(position: Position): void {
    // Create a new rect object based on the menu element
    this.rect = Rect.create(this.menuBaseElement.nativeElement);

    // Set the position of the menu rect to the provided x and y coordinates
    this.rect.setPosition(position);

    // Check if the menu extends beyond the right edge of the window
    if (this.rect.extendsWindowRight) {
      // Flip the menu horizontally
      this.rect.flipX();

      // If the menu also extends beyond the left edge of the window after flipping,
      // reposition it to fit within the window horizontally
      if (this.rect.extendsWindowLeft) {
        this.rect.positionWindowLeft();
      }
    }

    // Check if the menu extends beyond the bottom edge of the window
    if (this.rect.extendsWindowBottom) {
      // Flip the menu vertically
      this.rect.flipY();


      // If the menu also extends beyond the top edge of the window after flipping,
      // reposition it to fit within the window vertically
      if (this.rect.extendsWindowTop) {
        this.rect.positionWindowBottom();
      }
    }
  }




  // This method calculates the position of a submenu relative to its parent menu element.
  // It considers the parent's position and dimensions to determine where the submenu should be placed.
  protected getSubmenuPosition(submenu: Menu, parentMenuElement: HTMLElement) {
    // Get the position and dimensions of the parent menu element
    const parentElementRect = parentMenuElement.getBoundingClientRect();

    // Check if the submenu exceeds the right boundary of the viewport or if the parent menu is off-screen to the left
    if (parentElementRect.x + parentMenuElement.clientWidth + submenu.width > document.body.offsetWidth + window.scrollX ||
      parentMenuElement.offsetLeft < 0) {


      // check if moving the submenu to the left would cause it to go off-screen completely
      if (parentElementRect.x - submenu.width + 2 < 0) {
        // This will place the submenu at the left edge of the window (-1 accounts for the border)
        return -1;
      }

      // Return the negative width of the submenu to position it to the left of the parent element
      return -submenu.width;
    }

    // If the submenu fits within the viewport width, return the width of the parent menu
    return parentMenuElement.clientWidth;
  }




  protected onMenuItemMouseOver(menuItem: MenuItem, menu: Menu, menuItemElement: HTMLElement): void {
    // If the current menuItem is already selected, mark its submenu as not dirty and exit
    if (menuItem === menu.selectedMenuItem) {
      if (menuItem.submenu) menuItem.submenu.isDirty = false;
      return;
    }

    // If the previously selected menu item's submenu is dirty, hide it
    if (menu.selectedMenuItem?.submenu?.isDirty)
      this.showSubmenu(menu.selectedMenuItem.submenu, false);


    // Mark the menu as dirty and update the selected menu item
    menu.isDirty = true;
    menu.selectedMenuItem = menuItem;

    // Show the submenu of the newly selected menu item, if it exists
    if (menu.selectedMenuItem.submenu)
      this.showSubmenu(menu.selectedMenuItem.submenu);


    // If the selected menu item is not dirty, mark it as dirty and add a mouse leave listener
    if (!menu.selectedMenuItem.isDirty) {
      menu.selectedMenuItem.isDirty = true;

      this.addMouseLeaveListener(menuItemElement, menu);
    }
  }



  protected onItemClick(menuItem: MenuItem): void {
    if (menuItem.action && !menuItem.disabled) {
      // Execute the menu item action and close the menu
      menuItem.action();
      this.close();
    }
  }



  protected onSubmenuMouseOver(menuItem: MenuItem, menuItemElement: HTMLElement, menu: Menu): void {
    // Checking if the submenu has a selectedMenuItem and also
    // ensuring that the submenu's parent menu does not have a selected item
    if (menuItem.submenu?.selectedMenuItem && !menuItem.submenu.parentMenu.selectedMenuItem) {
      // Set the submenu's parent menu's selected item to the current menu item
      menuItem.submenu.parentMenu.selectedMenuItem = menuItem;

      // Mark the current submenu item as dirty
      menuItem.isDirty = true;

      // Clear any existing timeout for the submenu
      clearTimeout(menuItem.submenu.timeoutId);

      // Add a listener for the mouse leaving the menuItemElement
      this.addMouseLeaveListener(menuItemElement, menu);
    }
  }




  private addMouseLeaveListener(menuItemElement: HTMLElement, menu: Menu) {
    const unlisten = this.renderer.listen(menuItemElement, 'mouseleave', () => this.onMouseLeave(menu, unlisten));
  }




  private onMouseLeave(menu: Menu, unlisten: () => void): void {
    // Check if there's no selected menu item or the submenu is dirty, if so, return.
    if (!menu.selectedMenuItem || menu.selectedMenuItem.submenu?.isDirty) return;

    // If there's a submenu for the selected menu item, hide it.
    if (menu.selectedMenuItem.submenu)
      this.showSubmenu(menu.selectedMenuItem.submenu, false);

    // Mark the selected menu item as not dirty and reset it to null.
    menu.selectedMenuItem.isDirty = false;
    menu.selectedMenuItem = null;

    // Stop listening to mouse leave events.
    unlisten();
  }





  private showSubmenu(submenu: Menu, value: boolean = true): void {
    // Setting the delay before displaying the submenu
    const submenuDelay: number = 600;

    // Clear any existing timeout for the submenu to prevent multiple simultaneous actions
    clearTimeout(submenu.timeoutId);

    // Set a new timeout to control when the submenu is displayed or hidden
    submenu.timeoutId = setTimeout(() => {
      // Depending on the 'value', either show the submenu or hide it by calling the 'hideSubmenus' method
      value ? submenu.show = true : this.hideSubmenus(submenu);
    }, submenuDelay);
  }








  private hideSubmenus(submenu?: Menu): void {
    // Checks if the submenu exists and is set to show
    if (submenu?.show) {
      // Hides the current submenu by setting its show property to false
      submenu.show = false;

      // Resets the dirty flag for the submenu to indicate it's not dirty anymore
      submenu.isDirty = false;

      // Checks if there is a selected menu item within the submenu
      if (submenu.selectedMenuItem) {
        // Resets the dirty flag for the selected menu item to indicate it's not dirty anymore
        submenu.selectedMenuItem.isDirty = false;

        // Clears the selected menu item by setting it to null
        submenu.selectedMenuItem = null;
      }

      // Recursively hides submenus within the current submenu's menu items
      submenu.menuItems.forEach((menuItem: MenuItem) => this.hideSubmenus(menuItem.submenu));
    }
  }



  private getLastMenu(menu: Menu): Menu {
    // Initialize the current last menu item with the provided menu
    let currentLastMenu: Menu = menu;

    // Loop through each menu item in the provided menu
    menu.menuItems.forEach((menuItem: MenuItem) => {
      // Check if the current menu item has a submenu and it is set to be shown
      if (menuItem.submenu && menuItem.submenu.show) {

        // Recursively call getLastMenu to find the last visible menu item in the submenu
        // Update the currentLastMenu if a visible item deeper in the submenu is found
        currentLastMenu = this.getLastMenu(menuItem.submenu) || currentLastMenu;
      }
    });

    // Return the last visible menu item found
    return currentLastMenu;
  }



  public override close(): void {
    this.show = false;
    this.onEndClose.emit(this);
  }



  @HostListener('document:keydown', ['$event'])
  protected onKeyPress(event: KeyboardEvent): void {

    // Check if the pressed key is 'Escape'
    if (event.key === 'Escape') {
      // Retrieve the last menu in the hierarchy
      const lastMenu = this.getLastMenu(this.menu);

      // If the last menu is the same as the main menu, close it
      if (lastMenu == this.menu) {
        this.close();
      } else {

        // Otherwise, hide the last menu
        lastMenu.show = false;
      }
    }
  }
}