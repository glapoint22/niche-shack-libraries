import { Component, ElementRef, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWindowContentComponent } from '../../models/modal-window-content-component';
import { DynamicComponentContainer } from '../../models/dynamic-component-container';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { takeUntil } from 'rxjs';
import { DynamicComponent } from '../../models/dynamic-component';

@Component({
  selector: 'ns-modal-window-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-window-container.component.html',
  styleUrls: ['./modal-window-container.component.scss']
})
export class ModalWindowContainerComponent<T extends ModalWindowContentComponent> extends DynamicComponentContainer<ModalWindowComponent<T>> {
  @Output()
  public onModalWindowOpen: EventEmitter<void> = new EventEmitter();

  protected override zLevel: number = 100000;

  protected showBackdrop!: boolean;

  // Reference to the element's DOM
  private el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

  // Reference to the HTML body element
  private body!: HTMLElement;

  // Flag to track if the mouse is down on the backdrop
  private mouseDownOnBackdrop!: boolean;


  protected ngOnInit(): void {
    // Initialize the body element reference
    this.body = this.el.nativeElement.ownerDocument.body;
  }


  protected override initializeComponent(modalWindow: ModalWindowComponent<T>): void {
    const backdropDelayDuration: number = 50;

    super.initializeComponent(modalWindow);

    modalWindow.onBeginClose
      .pipe(
        takeUntil(modalWindow.onDestroy)
      )
      .subscribe((modalWindow: DynamicComponent) => {
        this.close(modalWindow as ModalWindowComponent<T>);
      });


    // Check if this is the first modal window and set up the backdrop
    if (this.components.length === 1) {

      // Prevent scrolling on the body
      this.renderer.setStyle(this.body, 'overflow', 'hidden');

      // Emit an event to indicate that a modal window is open
      this.onModalWindowOpen.emit();


      // Set a timeout to display the backdrop
      setTimeout(() => {
        this.showBackdrop = true;
      }, backdropDelayDuration);
    }
  }



  protected onTransitionEnd(): void {
    if (!this.showBackdrop && this.components.length === 0) {

      // Re-enable scrolling on the body when no modal windows are open
      this.renderer.setStyle(this.body, 'overflow', 'auto');
    }
  }


  protected override onMousedown(): void {
    // Set the flag to indicate that the mouse is down on the backdrop
    this.mouseDownOnBackdrop = true;
  }


  protected onMouseup(): void {
    // Check if the mouse was down on the backdrop and close the top modal window
    if (this.mouseDownOnBackdrop) this.close(this.components[this.components.length - 1]);

    // Reset the flag
    this.mouseDownOnBackdrop = false;
  }


  private close(modalWindow: ModalWindowComponent<T>): void {
    // Call the modal window's close method
    if (!modalWindow.closed) modalWindow.close();


    if (this.components.length === 1) {
      // Hide the backdrop if this was the last modal window
      this.showBackdrop = false;
    }
  }
}