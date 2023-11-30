import { ContentComponent } from "../models/content-component";
import { IDynamicComponent } from "./i-dynamic-component";

export interface IContentHostComponent<T extends ContentComponent> extends IDynamicComponent {
    /**
     * The content component hosted by this host component.
     */
    contentComponent: T;
}