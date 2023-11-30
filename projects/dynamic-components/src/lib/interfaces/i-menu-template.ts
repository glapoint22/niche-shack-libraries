import { MenuItemTemplate } from "../models/menu-item-template";
import { MenuItemOptions } from "./menu-item-options";

/**
 * Represents a template for a menu.
 */
export interface IMenuTemplate {
    /**
     * Adds a new menu item to the menu template.
     * @param label - The label text for the menu item.
     * @param options - Additional options for the menu item.
     * @returns A MenuItemTemplate representing the added menu item.
     */
    addItem(label: string, options?: MenuItemOptions): MenuItemTemplate;

    /**
     * Adds a divider to the menu template.
     * Dividers are visual separations between menu items.
     */
    addDivider(): void;
}
