import { IMenuItem } from "../interfaces/i-menu-item";
import { IMenuTemplate } from "../interfaces/i-menu-template";
import { MenuItemOptions } from "../interfaces/menu-item-options";
import { MenuItem } from "./menu-item";
import { MenuItemTemplate } from "./menu-item-template";

export class MenuTemplate implements IMenuTemplate {
    private _menuItems: Array<IMenuItem> = new Array();
    public get menuItems(): Array<IMenuItem> {
        return this._menuItems;
    }


    public addItem(label: string, options?: MenuItemOptions): MenuItemTemplate {
        const menuItem = new MenuItem(label, options);

        this._menuItems.push(menuItem);
        return new MenuItemTemplate(menuItem);
    }


    public addDivider(): void {
        this._menuItems.push(new MenuItem());
    }
}