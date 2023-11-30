import { ModalWindowContentComponent } from "../models/modal-window-content-component";
import { IContentHostComponent } from "./i-content-host-component";

/**
 * Interface representing a modal window component that hosts a specific modal window content component type.
 * @template T - The type of modal window content component.
 */
export interface IModalWindowComponent<T extends ModalWindowContentComponent> extends IContentHostComponent<T> { }