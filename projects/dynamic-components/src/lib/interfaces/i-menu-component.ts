import { IDynamicComponent } from "./i-dynamic-component";
import { IMenu } from "./i-menu";

export interface IMenuComponent extends IDynamicComponent {
    menu: IMenu;
}