import { IMenu } from "../interfaces/i-menu";
import { IMenuTemplate } from "../interfaces/i-menu-template";
import { Menu } from "../models/menu";
import { MenuItem } from "../models/menu-item";
import { MenuTemplate } from "../models/menu-template";

/**
 * Class responsible for building menus.
 */
export class MenuBuilder {

    private constructor() { }

    /**
 * Creates a new instance of MenuBuilder.
 * @returns A new instance of MenuBuilder.
 */
    public static create() {
        return new MenuBuilder();
    }

    /**
     * Creates a new menu template.
     * @returns An instance of IMenuTemplate.
     */
    public createMenuTemplate(): IMenuTemplate {
        return new MenuTemplate();
    }



    /**
     * Builds a menu based on the provided menu template.
     * @param menuTemplate - The menu template to build the menu from.
     * @returns An instance of IMenu representing the built menu.
     */
    public buildMenu(menuTemplate: IMenuTemplate): IMenu {
        // Create a new menu instance
        const menu: IMenu = new Menu();

        // Assign menu items from the provided template to the menu being generated
        menu.menuItems = (menuTemplate as MenuTemplate).menuItems;

        // Set submenus and return the final generated menu
        this.setSubmenus(menu as Menu);
        return menu;
    }



    private setSubmenus(menu: Menu): void {
        menu.menuItems.forEach((menuItem: MenuItem) => {
            if (menuItem.submenu) {
                const currentSubmenu = menuItem.submenu;

                // Set the parent menu for the current submenu
                currentSubmenu.parentMenu = menu;

                // Calculate and set width for the submenu
                this.setWidth(currentSubmenu);

                // Recursively set submenus for the current submenu
                this.setSubmenus(menuItem.submenu);
            }
        });
    }




    private setWidth(submenu: Menu): void {
        // Create a temporary DOM element to calculate submenu width
        const submenuElement = this.createElement('div', { className: 'menu' });

        // Set element styles for calculation (hidden and absolute positioning)
        submenuElement.style.visibility = 'hidden';
        submenuElement.style.position = 'absolute';

        // Iterate through submenu items to calculate width
        submenu.menuItems.forEach((menuItem: MenuItem) => {
            if (menuItem.label) {
                const menuItemElement = this.createElement('div', { className: 'menu-item' });
                const menuItemContentElement = this.createElement('div', { className: 'menu-item-content' });
                const labelElement = this.createElement('div', { textContent: menuItem.label });

                // Append the label element to the menu Item content element
                menuItemContentElement.appendChild(labelElement);

                // Shortcut
                if (menuItem.shortcut) {
                    const shortcutElement = this.createElement('div', {
                        className: 'menu-item-content-padding',
                        textContent: menuItem.shortcut
                    });

                    // Append the shortcut element to the menu Item content element
                    menuItemContentElement.appendChild(shortcutElement);
                }

                // Submenu
                if (menuItem.submenu) {
                    const chevronElement = this.createElement('i', {
                        className: 'fa fa-chevron-right menu-item-content-padding'
                    });

                    menuItemContentElement.className += ' submenu-item';

                    // Append the chevron element to the menu Item content element
                    menuItemContentElement.appendChild(chevronElement);
                }

                menuItemElement.appendChild(menuItemContentElement);
                submenuElement.appendChild(menuItemElement);
            }
        });

        // Add the temporary DOM element to the body to get calculated width
        document.body.appendChild(submenuElement);

        // Set the calculated width to the submenu object
        submenu.width = submenuElement.getBoundingClientRect().width;

        // Remove the temporary DOM element from the body
        document.body.removeChild(submenuElement);
    }


    // Utility method to create HTML elements
    private createElement(tagName: string, options?: {
        className?: string,
        textContent?: string
    }): HTMLElement {
        // Create a new HTML element
        const element = document.createElement(tagName);

        // Set element's class name if provided in options
        if (options?.className) {
            element.className = options.className;
        }

        // Set element's text content if provided in options
        if (options?.textContent) {
            element.textContent = options.textContent;
        }

        // Return the created HTML element
        return element;
    }
}