import { MenuItemIcon } from "../models/menu-item-icon";
import { IMenu } from "./i-menu";

export interface IMenuItem {
    readonly label: string | undefined;
    readonly shortcut: string | undefined;
    readonly icon: MenuItemIcon | undefined;
    readonly submenu: IMenu | undefined;
    readonly disabled: boolean | undefined;
    readonly hidden: boolean | undefined;
}