import { ComponentRef, Directive, Renderer2, Type, ViewChild, ViewContainerRef, inject } from "@angular/core";
import { DynamicComponent } from "./dynamic-component";
import { takeUntil } from "rxjs";

@Directive()
export abstract class DynamicComponentContainer<T extends DynamicComponent> {
    @ViewChild('viewContainerRef', { read: ViewContainerRef })
    private viewContainerRef!: ViewContainerRef;

    protected components: Array<T> = new Array<T>();
    protected renderer: Renderer2 = inject(Renderer2);
    private removeMousedownListener!: () => void;

    // The z-level of the container, indicating its stacking order relative to other containers.
    // Containers with higher z-level values appear on top of containers with lower values.
    protected abstract zLevel: number;


    // Create a new component of the specified type
    public create(componentType: Type<T>): T {
        const componentRef: ComponentRef<T> = this.viewContainerRef.createComponent(componentType);
        const component: T = componentRef.instance;

        this.initializeComponent(component);

        return component;
    }


    protected initializeComponent(component: T): void {
        this.components.push(component);

        // Subscribe to the 'onClosed' event and clean up when the component is destroyed
        component.onEndClose
            .pipe(takeUntil(component.onDestroy))
            .subscribe((closedComponent: DynamicComponent) => this.onComponentClose(closedComponent as T));


        // Set the zIndex for the component
        component.setZIndex(this.getZindex());


        // Add a 'mousedown' event listener if this is the first component
        if (this.components.length === 1)
            this.removeMousedownListener = this.renderer.listen('window', 'mousedown', () => this.onMousedown());
    }



    private onComponentClose(component: T): void {
        const index = this.components.findIndex(x => x === component);

        this.viewContainerRef.remove(index);
        this.components.splice(index, 1);


        // Remove the 'mousedown' event listener if no more components exist
        if (this.components.length === 0)
            this.removeMousedownListener();
    }



    protected getZindex(): number {
        return this.components.length - 1 + this.zLevel;
    }


    protected abstract onMousedown(): void;
}