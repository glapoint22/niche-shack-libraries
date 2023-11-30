import { IMenu } from "../interfaces/i-menu";
import { IMenuTemplate } from "../interfaces/i-menu-template";
import { Menu } from "./menu";
import { MenuItem } from "./menu-item";
import { MenuItemIcon } from "./menu-item-icon";
import { MenuTemplate } from "./menu-template";

/**
 * Represents a template for a menu item.
 */
export class MenuItemTemplate {
    constructor(private menuItem: MenuItem) { }

    /**
     * Sets a keyboard shortcut for the menu item.
     * @param value - The keyboard shortcut value to set.
     */
    public setShortcut(value: string): void {
        this.menuItem.shortcut = value;
    }

    /**
     * Sets an icon for the menu item.
     * @param classNames - The CSS class names for the icon.
     * @param color - The color of the icon.
     */
    public setIcon(classNames: string, color: string): void {
        this.menuItem.icon = MenuItemIcon.create(classNames, color);
    }

    /**
     * Adds a submenu to the menu item.
     * @param submenu - The submenu template to add.
     */
    public addSubmenu(submenu: IMenuTemplate): void {
        const menu: IMenu = new Menu();

        menu.menuItems = (submenu as MenuTemplate).menuItems;
        this.menuItem.submenu = menu as Menu;
    }

    /**
     * Sets the menu item as disabled or enabled.
     * @param value - Boolean value indicating if the menu item should be disabled.
     */
    public setDisabled(value: boolean): void {
        this.menuItem.disabled = value;
    }

    /**
     * Sets whether the menu item should be hidden or visible.
     * @param value - Boolean value indicating if the menu item should be hidden.
     */
    public setHidden(value: boolean): void {
        this.menuItem.hidden = value;
    }

    /**
     * Sets the action/function triggered by selecting the menu item.
     * @param action - The function to be triggered on menu item selection.
     */
    public setAction(action: Function): void {
        this.menuItem.action = action;
    }
}