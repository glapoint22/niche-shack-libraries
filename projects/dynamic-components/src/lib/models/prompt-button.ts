
/**
 * Represents a button used in prompts.
 */
export class PromptButton {

    private constructor(public name: string, public func?: Function) { }

    /**
 * Creates a Button with the specified name.
 * @param name - The name of the Button.
 * @returns A Button instance.
 */
    public static create(name: string): PromptButton;

    /**
     * Creates a Button with the specified name and event handler function.
     * @param name - The name of the Button.
     * @param func - The event handler function for the Button.
     * @returns A Button instance.
     */
    public static create(name: string, func: Function): PromptButton;

    public static create(name: string, func?: Function): PromptButton {
        return new PromptButton(name, func);
    }
}