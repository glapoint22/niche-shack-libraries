import { Directive, EventEmitter, Output } from "@angular/core";

@Directive()
export abstract class ContentComponent {
    @Output()
    public onClose: EventEmitter<void> = new EventEmitter();

    protected close(): void {
        this.onClose.emit();
    }
}