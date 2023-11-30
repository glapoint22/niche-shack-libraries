import { IMenuItem } from "../interfaces/i-menu-item";
import { MenuItemOptions } from "../interfaces/menu-item-options";
import { Menu } from "./menu";
import { MenuItemIcon } from "./menu-item-icon";

export class MenuItem implements IMenuItem {
    public submenu: Menu | undefined;
    public action: Function | undefined;
    public divider!: boolean;
    public label!: string | undefined;
    public isDirty!: boolean;
    public disabled: boolean | undefined;
    public hidden: boolean | undefined;
    public shortcut: string | undefined;
    public icon: MenuItemIcon | undefined;

    constructor(label?: string, options?: MenuItemOptions) {
        this.label = label;
        this.divider = label ? false : true;
        this.shortcut = options?.shortcut;
        this.icon = options?.icon;
        this.disabled = options?.disabled;
        this.action = options?.action;
        this.hidden = options?.hidden;
    }
}