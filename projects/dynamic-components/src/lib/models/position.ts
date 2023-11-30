export class Position {
    public get x(): number {
        return this._x;
    }


    public get y(): number {
        return this._y;
    }

    private constructor(private _x: number, private _y: number) { }


    /**
     * Creates a Position object using x and y coordinates.
     * @param x - The x-coordinate value.
     * @param y - The y-coordinate value.
     * @returns A new Position object.
     */
    public static create(x: number, y: number): Position;


    /**
     * Creates a Position object using MouseEvent coordinates.
     * @param mouseEvent - The MouseEvent containing clientX and clientY values.
     * @returns A new Position object based on MouseEvent coordinates.
     */
    public static create(mouseEvent: MouseEvent): Position;

    public static create(arg1: number | MouseEvent, y?: number): Position {
        if (arg1 instanceof MouseEvent) {
            const event: MouseEvent = arg1;

            return new Position(event.clientX, event.clientY);
        }

        return new Position(arg1, y!);
    }
}