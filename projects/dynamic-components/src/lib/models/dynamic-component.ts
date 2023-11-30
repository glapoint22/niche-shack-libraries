import { Directive, EventEmitter, Output } from "@angular/core";
import { Rect } from "./rect";
import { IDynamicComponent } from "../interfaces/i-dynamic-component";

@Directive()
export abstract class DynamicComponent implements IDynamicComponent {
    @Output()
    public onBeginClose: EventEmitter<DynamicComponent> = new EventEmitter();

    @Output()
    public onEndClose: EventEmitter<DynamicComponent> = new EventEmitter();

    @Output()
    public onDestroy: EventEmitter<void> = new EventEmitter();

    @Output()
    public onOpen: EventEmitter<void> = new EventEmitter();

    // Show/hide flag
    protected show!: boolean;

    // Component's position and dimensions
    protected rect: Rect = Rect.create();


    // Z Index for stacking order
    private _zIndex!: number;
    public get zIndex(): number {
        return this._zIndex;
    }

    private timeoutId!: any;



    protected ngAfterViewInit(): void {
        this.timeoutId = setTimeout(() => {
            this.show = true;
            this.onOpen.emit();
        }, 50);
    }



    protected onTransitionEnd(): void {
        if (!this.show) {
            this.onEndClose.emit(this);
        }
    }




    public setZIndex(value: number) {
        this._zIndex = value;
    }




    public close(): void {
        this.show = false;
        clearTimeout(this.timeoutId);
        this.onBeginClose.emit(this);
    }



    protected ngOnDestroy() {
        this.onDestroy.emit();
    }
}