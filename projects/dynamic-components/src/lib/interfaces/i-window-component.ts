import { ContentComponent } from "../models/content-component";
import { IContentHostComponent } from "./i-content-host-component";

/**
 * Interface representing a window component that hosts a specific content component type.
 * @template T - The type of content component.
 */
export interface IWindowComponent<T extends ContentComponent> extends IContentHostComponent<T> { }