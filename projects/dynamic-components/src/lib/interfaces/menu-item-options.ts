import { MenuItemIcon } from "../models/menu-item-icon";

/**
 * Represents options available for a menu item.
 */
export interface MenuItemOptions {
    /**
     * Represents a keyboard shortcut associated with the menu item.
     */
    shortcut?: string;

    /**
     * Represents an icon associated with the menu item.
     */
    icon?: MenuItemIcon;

    /**
     * Indicates whether the menu item is disabled or not.
     */
    disabled?: boolean;

    /**
     * Indicates whether the menu item is hidden or not.
     */
    hidden?: boolean;

    /**
     * Represents the action/function triggered by selecting the menu item.
     */
    action?: Function;
}