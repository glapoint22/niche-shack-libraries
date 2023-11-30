/**
 * Represents an icon associated with a menu item.
 */
export class MenuItemIcon {

    private constructor(public classNames: string, public color: string) { }

    /**
 * Creates a new instance of MenuItemIcon with provided classNames and color.
 * @param classNames The CSS class names for the icon.
 * @param color The color of the icon.
 * @returns A new instance of MenuItemIcon.
 */
    public static create(classNames: string, color: string): MenuItemIcon {
        return new MenuItemIcon(classNames, color);
    }
}