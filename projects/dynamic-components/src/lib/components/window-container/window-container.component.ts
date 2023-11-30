import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from '../../models/content-component';
import { DynamicComponentContainer } from '../../models/dynamic-component-container';
import { WindowComponent } from '../window/window.component';
import { takeUntil } from 'rxjs';
import { CursorType } from '../../enums/cursor-type';

@Component({
  selector: 'ns-window-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './window-container.component.html',
  styleUrls: ['./window-container.component.scss']
})
export class WindowContainerComponent<T extends ContentComponent> extends DynamicComponentContainer<WindowComponent<T>> {
  protected override zLevel: number = 1000;
  private currentSelectedWindow!: WindowComponent<T> | null;
  protected cursor!: string | null;

  // A boolean flag to track whether a window was explicitly selected (activated)
  // by a user interaction, such as a mouse down. It helps distinguish between
  // user-initiated window selections and programmatic window selections.
  private userSelectedWindow!: boolean;



  protected override initializeComponent(window: WindowComponent<T>): void {
    // Call the base class initialization
    super.initializeComponent(window);

    // Set the provided window as the selected window
    this.setSelectedWindow(window);


    // Subscribe to the 'onSelected' event of the window to track user selections
    window.onSelected
      .pipe(takeUntil(window.onDestroy))
      .subscribe((selectedWindow: WindowComponent<T>) => {
        // Flag that a user selected this window
        this.userSelectedWindow = true;

        // Set the selected window and bring it to the front
        this.setSelectedWindow(selectedWindow);
        this.bringComponentToFront(selectedWindow);
      });


    // Subscribe to the 'onCursorChange' event of the window to track cursor changes
    window.onCursorChange
      .pipe(takeUntil(window.onDestroy))
      .subscribe((cursorType: CursorType) => {
        this.cursor = cursorType;
      });
  }


  private setSelectedWindow(window: WindowComponent<T>): void {
    // Check if there is already a selected window
    if (this.currentSelectedWindow) {

      // If the new window is the same as the currently selected window, do nothing
      if (this.currentSelectedWindow === window) return;

      // Deselect the currently selected window since a different window is being selected
      this.currentSelectedWindow.setSelected(false);
    }

    // Set the provided window as the current selected window
    this.currentSelectedWindow = window;
    this.currentSelectedWindow.setSelected(true);
  }



  private bringComponentToFront(window: WindowComponent<T>) {
    // Get the current zIndex for the component.
    let zIndex = this.getZindex();

    // Set the zIndex of the specified window to the calculated value.
    window.setZIndex(zIndex);

    // Check if there are multiple components in the collection.
    if (this.components.length > 1) {
      // Create a copy of the components array and sort it in descending order based on zIndex.
      const sortedComponents = [...this.components].sort((a, b) => b.zIndex - a.zIndex);

      // Iterate through the sorted components.
      sortedComponents.forEach((currentWindow: WindowComponent<T>) => {
        // Skip the current window being processed.
        if (currentWindow != window) {

          // Check if the zIndex of the current component is the same as the new zIndex.
          if (currentWindow.zIndex === zIndex) {

            // If it is, decrement the zIndex to avoid conflicts.
            zIndex--;

            // Update the zIndex of the current component to the new zIndex value.
            currentWindow.setZIndex(zIndex);
          }
        }
      });
    }
  }


  protected override onMousedown(): void {
    // Check if a window was recently selected by a user action
    if (this.userSelectedWindow) {

      // Reset the flag to indicate that the window was not selected by a user action
      this.userSelectedWindow = false;
      return;
    }

    // If there is a selected window, deslect the window
    this.deselectWindow();
  }




  public deselectWindow(): void {
    // If there is a selected window
    if (this.currentSelectedWindow) {

      // Deselect the currently selected window
      this.currentSelectedWindow.setSelected(false);
      this.currentSelectedWindow = null;
    }
  }
}