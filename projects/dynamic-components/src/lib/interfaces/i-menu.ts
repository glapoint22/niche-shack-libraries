import { IMenuItem } from "./i-menu-item";

export interface IMenu {
    menuItems: ReadonlyArray<IMenuItem>;
}