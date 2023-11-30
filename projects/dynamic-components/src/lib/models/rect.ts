import { Position } from "./position";

export class Rect {
    // Extends Window Top
    public get extendsWindowTop(): boolean {
        return this.y - window.scrollY < 0;
    }


    // Extends Window Right
    public get extendsWindowRight(): boolean {
        return this.x + this.width > document.body.offsetWidth + window.scrollX;
    }


    // Extends Window Bottom
    public get extendsWindowBottom(): boolean {
        return this.y + this.height - window.scrollY > window.innerHeight;
    }


    // Extends Window Left
    public get extendsWindowLeft(): boolean {
        return this.x - window.scrollX < 0;
    }


    public get position(): Position {
        return Position.create(this.x, this.y);
    }


    private constructor(public x: number, public y: number, public width: number, public height: number) { }


    /**
     * Creates an empty Rect object.
     * @returns An empty Rect object.
     */
    public static create(): Rect;


    /**
   * Creates a Rect object with specified coordinates and dimensions.
   * @param x - The x-coordinate of the rectangle.
   * @param y - The y-coordinate of the rectangle.
   * @param width - The width of the rectangle.
   * @param height - The height of the rectangle.
   * @returns A new Rect object.
   */
    public static create(x: number, y: number, width: number, height: number): Rect;

    /**
     * Creates a Rect object based on an HTMLElement's bounding box.
     * @param element - The HTML element to create the rectangle from.
     * @returns A new Rect object representing the element's bounding box.
     */
    public static create(element: HTMLElement): Rect;

    /**
     * Creates a Rect object with specified dimensions, positioned at the center of the screen.
     * @param width - The width of the rectangle.
     * @param height - The height of the rectangle.
     * @returns A new Rect object with its position at the center of the screen.
     */
    public static create(width: number, height: number): Rect;

    /**
     * Creates a copy of the provided Rect object.
     * @param rect - The Rect object to copy.
     * @returns A new Rect object identical to the provided rectangle.
     */
    public static create(rect: Rect): Rect;



    static create(arg1?: number | HTMLElement | Rect, arg2?: number, width?: number, height?: number): Rect {
        // Overload 1 implementation
        if (arg1 === undefined && arg2 === undefined && width === undefined && height === undefined) {
            return new Rect(0, 0, 0, 0);

            // Overload 2 implementation
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof width === 'number' && typeof height === 'number') {
            return new Rect(arg1, arg2, width, height);

            // Overload 3 implementation
        } else if (arg1 instanceof HTMLElement) {

            const rect = arg1.getBoundingClientRect();
            return new Rect(rect.x, rect.y, rect.width, rect.height);

            // Overload 4 implementation
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {

            const x = window.innerWidth * 0.5 - arg1 * 0.5;
            const y = window.innerHeight * 0.5 - arg2 * 0.5;

            return new Rect(x, y, arg1, arg2);

            // Overload 5 implementation
        } else if (arg1 instanceof Rect) {

            const rect = arg1;

            return new Rect(rect.x, rect.y, rect.width, rect.height);
        } else {
            throw new Error('Invalid parameters provided');
        }
    }


    /**
   * Sets the position using specified x and y coordinates.
   * @param x - The x-coordinate for the position.
   * @param y - The y-coordinate for the position.
   */
    public setPosition(x: number, y: number): void;

    /**
     * Sets the position using a Position object.
     * @param position - The Position object containing x and y coordinates.
     */
    public setPosition(position: Position): void;

    public setPosition(arg1: number | Position, y?: number) {
        if (arg1 instanceof Position) {
            const position: Position = arg1;

            this.x = position.x;
            this.y = position.y;
        } else {
            this.x = arg1;
            this.y = y!;
        }
    }


    public setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }


    public flipX(): void {
        this.x = this.x - this.width;
    }


    public flipY(): void {
        this.y = this.y - this.height;
    }


    public positionWindowTop(): void {
        this.y = window.scrollY;
    }


    public positionWindowRight(): void {
        this.x = document.body.offsetWidth + window.scrollX - this.width;
    }


    public positionWindowBottom(): void {
        this.y = window.innerHeight + window.scrollY - this.height;
    }


    public positionWindowLeft(): void {
        this.x = window.scrollX;
    }
}