import { EventEmitter } from "@angular/core";
import { DynamicComponent } from "../models/dynamic-component";

export interface IDynamicComponent {
    /**
     * Event emitter triggered when the component begins to close.
     */
    onBeginClose: EventEmitter<DynamicComponent>;

    /**
     * Event emitter triggered when the component is done closing.
     */
    onEndClose: EventEmitter<DynamicComponent>;

    /**
     * Event emitter triggered when the component is opened.
     */
    onOpen: EventEmitter<void>;

    /**
     * Method to close the component.
     */
    close(): void;
}