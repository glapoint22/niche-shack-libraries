export class Button {

    private constructor(public name: string, public func?: Function) { }

    /**
 * Creates a Button with the specified name.
 * @param name - The name of the Button.
 * @returns A Button instance.
 */
    public static create(name: string): Button;

    /**
     * Creates a Button with the specified name and event handler function.
     * @param name - The name of the Button.
     * @param func - The event handler function for the Button.
     * @returns A Button instance.
     */
    public static create(name: string, func: Function): Button;

    public static create(name: string, func?: Function): Button {
        return new Button(name, func);
    }
}