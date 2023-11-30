import { ComponentRef, Directive, EventEmitter, Output, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { DynamicComponent } from "./dynamic-component";
import { ContentComponent } from "./content-component";
import { take } from "rxjs";
import { IContentHostComponent } from "../interfaces/i-content-host-component";

@Directive()
export abstract class ContentHostComponent<T extends ContentComponent> extends DynamicComponent implements IContentHostComponent<T> {
    // Content Container
    @ViewChild('contentContainer', { read: ViewContainerRef })
    private contentContainer!: ViewContainerRef;

    @Output()
    public onContentCreated: EventEmitter<void> = new EventEmitter();

    private contentComponentType!: Type<T>;

    // Content Component
    public contentComponent!: T;


    protected override ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.createContentComponent();
    }




    protected setContent(contentComponentType: Type<T>): void {
        this.contentComponentType = contentComponentType;
    }



    protected createContentComponent(): void {
        const componentRef: ComponentRef<T> = this.contentContainer.createComponent(this.contentComponentType);
        this.contentComponent = componentRef.instance;

        this.contentComponent.onClose
            .pipe(take(1))
            .subscribe(() => this.close());

        this.onContentCreated.emit();
    }
}