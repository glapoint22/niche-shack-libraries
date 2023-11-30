import { IMenu } from "../interfaces/i-menu";
import { MenuItem } from "./menu-item";

export class Menu implements IMenu {
    public menuItems: Array<MenuItem> = new Array();
    public show!: boolean;
    public selectedMenuItem!: MenuItem | null;
    public isDirty!: boolean;
    public timeoutId: any;
    public width!: number;
    public parentMenu!: Menu;
}