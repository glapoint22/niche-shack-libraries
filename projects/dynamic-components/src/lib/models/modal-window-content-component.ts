import { Directive, EventEmitter, Output } from "@angular/core";
import { ContentComponent } from "./content-component";

@Directive()
export abstract class ModalWindowContentComponent extends ContentComponent {
    @Output()
    public onHide: EventEmitter<boolean> = new EventEmitter();

    protected setHidden(value: boolean): void {
        this.onHide.emit(value);
    }
}