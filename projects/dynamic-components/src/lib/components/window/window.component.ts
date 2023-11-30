import { Component, ElementRef, EventEmitter, Output, Renderer2, Type, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from '../../models/content-component';
import { ContentHostComponent } from '../../models/content-host-component';
import { IContentHostComponent } from '../../interfaces/i-content-host-component';
import { CursorType } from '../../enums/cursor-type';
import { Rect } from '../../models/rect';

@Component({
  selector: 'ns-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './window.component.html'
})
export class WindowComponent<T extends ContentComponent> extends ContentHostComponent<T> implements IContentHostComponent<T> {
  @Output()
  public onSelected: EventEmitter<WindowComponent<T>> = new EventEmitter();

  @Output()
  public onCursorChange: EventEmitter<CursorType> = new EventEmitter();


  protected title!: string;
  protected maximized!: boolean;
  protected maximizeRestoreTransition!: boolean;
  protected isSelected!: boolean;

  private preventWindowDragOnButton!: boolean;
  private restoredRect!: Rect;


  // Constants for minimum width and height of the window
  private readonly minWidth: number = 200;
  private readonly minHeight: number = 135;


  // Flag to indicate if the cursor changed
  private cursorChanged!: boolean;


  // Renderer
  private renderer: Renderer2 = inject(Renderer2);

  private el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private body!: HTMLElement;


  public init(contentComponentType: Type<T>, title: string, rect: Rect) {
    this.setContent(contentComponentType);
    this.setTitle(title);
    this.setRect(rect);
  }


  protected override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.body = this.el.nativeElement.ownerDocument.body;
  }



  private setTitle(title: string): void {
    this.title = title;
  }




  public setRect(rect: Rect) {
    this.rect = rect;
  }




  public setSelected(value: boolean): void {
    this.isSelected = value;
  }





  protected onMaximizeRestoreClick(): void {
    this.maximized = !this.maximized;
    this.maximizeRestoreTransition = true;

    if (this.maximized) {
      // If the window is flagged to be maximized, save the current window rect in the "restoredRect" variable
      this.restoredRect = Rect.create(this.rect);

      // Set the window to cover the entire viewport
      this.rect = Rect.create(0, 0, window.innerWidth, window.innerHeight);
    } else {
      // If the window is flagged to not be maximized, restore the window to its previous state
      this.rect = Rect.create(this.restoredRect);
      this.renderer.setStyle(this.body, 'overflow', 'auto');
    }
  }




  protected override onTransitionEnd(): void {
    super.onTransitionEnd();
    this.maximizeRestoreTransition = false;

    if (this.maximized) this.renderer.setStyle(this.body, 'overflow', 'hidden');
  }



  protected onMousedown(): void {
    if (this.preventWindowDragOnButton) {
      this.preventWindowDragOnButton = false;
      return;
    }


    this.onMouseMove((mousemoveEvent: MouseEvent) => {

      // If the window is maximized
      if (this.maximized) {
        // Calculate the maximum value for the X coordinate of the window, ensuring it does not exceed the boundaries of the viewport
        const x = Math.min(window.innerWidth - this.restoredRect.width, Math.max(0, mousemoveEvent.x - this.restoredRect.width * 0.5));

        // restore the rect
        this.rect = Rect.create(x, 0, this.restoredRect.width, this.restoredRect.height);

        // Set the maximized flag to false, indicating that the window is no longer maximized
        this.maximized = false;
        this.renderer.setStyle(this.body, 'overflow', 'auto');
      }

      if (!this.cursorChanged) this.setCursor(CursorType.Default);
      this.rect.setPosition(this.rect.x + mousemoveEvent.movementX, this.rect.y + mousemoveEvent.movementY);
    });
  }



  protected onWindowBarButtonMousedown(): void {
    this.preventWindowDragOnButton = true;
  }





  protected onTopHandleMousedown(): void {
    this.resize(CursorType.NsResize, (mousemoveEvent: MouseEvent) => {
      const newHeight = this.calculateHeightOnTopHandleMousemove(mousemoveEvent.y);

      this.rect = Rect.create(this.rect.x, this.calculateYOnTopHandleMousemove(newHeight), this.rect.width, newHeight);
    });
  }



  protected onRightHandleMousedown(): void {
    this.resize(CursorType.EwResize, (mousemoveEvent: MouseEvent) => {
      this.rect.width = this.calculateWidthOnRightHandleMousemove(mousemoveEvent.x);
    });
  }



  protected onBottomHandleMousedown(): void {
    this.resize(CursorType.NsResize, (mousemoveEvent: MouseEvent) => {
      this.rect.height = this.calculateHeightOnBottomHandleMousemove(mousemoveEvent.y);
    });
  }



  protected onLeftHandleMousedown(): void {
    this.resize(CursorType.EwResize, (mousemoveEvent: MouseEvent) => {
      const newWidth = this.calculateWidthOnLeftHandleMousemove(mousemoveEvent.x);

      this.rect = Rect.create(this.calculateXOnLeftHandleMousemove(newWidth), this.rect.y, newWidth, this.rect.height);
    });
  }




  protected onTopLeftHandleMousedown(): void {
    this.resize(CursorType.SeResize, (mousemoveEvent: MouseEvent) => {
      const newWidth = this.calculateWidthOnLeftHandleMousemove(mousemoveEvent.x);
      const newHeight = this.calculateHeightOnTopHandleMousemove(mousemoveEvent.y);

      this.rect = Rect.create(
        this.calculateXOnLeftHandleMousemove(newWidth),
        this.calculateYOnTopHandleMousemove(newHeight),
        newWidth,
        newHeight);
    });
  }



  protected onTopRightHandleMousedown(): void {
    this.resize(CursorType.SwResize, (mousemoveEvent: MouseEvent) => {
      const newHeight = this.calculateHeightOnTopHandleMousemove(mousemoveEvent.y);

      this.rect = Rect.create(
        this.rect.x,
        this.calculateYOnTopHandleMousemove(newHeight),
        this.calculateWidthOnRightHandleMousemove(mousemoveEvent.x),
        newHeight);
    });
  }




  protected onBottomRightHandleMousedown(): void {
    this.resize(CursorType.NwResize, (mousemoveEvent: MouseEvent) => {
      this.rect.setSize(
        this.calculateWidthOnRightHandleMousemove(mousemoveEvent.x),
        this.calculateHeightOnBottomHandleMousemove(mousemoveEvent.y));
    });
  }



  protected onBottomLeftHandleMousedown(): void {
    this.resize(CursorType.SwResize, (mousemoveEvent: MouseEvent) => {
      const newWidth = this.calculateWidthOnLeftHandleMousemove(mousemoveEvent.x);

      this.rect = Rect.create(
        this.calculateXOnLeftHandleMousemove(newWidth),
        this.rect.y,
        newWidth,
        this.calculateHeightOnBottomHandleMousemove(mousemoveEvent.y));
    });
  }






  private resize(cursorType: CursorType, mouseMoveHandler: (event: MouseEvent) => void): void {
    this.setCursor(cursorType);

    this.onMouseMove((mousemoveEvent: MouseEvent) => {
      // Perform resizing logic
      mouseMoveHandler(mousemoveEvent);
    });
  }




  private calculateHeightOnTopHandleMousemove(mouseY: number): number {
    return Math.max(this.minHeight, this.rect.y + this.rect.height - mouseY);
  }



  private calculateWidthOnRightHandleMousemove(mouseX: number): number {
    return Math.max(this.minWidth, mouseX - this.rect.x);
  }



  private calculateHeightOnBottomHandleMousemove(mouseY: number): number {
    return Math.max(this.minHeight, mouseY - this.rect.y);
  }



  private calculateYOnTopHandleMousemove(newHeight: number): number {
    return this.rect.height - newHeight + this.rect.y;
  }


  private calculateWidthOnLeftHandleMousemove(mouseX: number): number {
    return Math.max(this.minWidth, this.rect.x + this.rect.width - mouseX);
  }



  private calculateXOnLeftHandleMousemove(newWidth: number): number {
    return this.rect.width - newWidth + this.rect.x;
  }


  private setCursor(cursorType: CursorType): void {
    this.cursorChanged = true;
    this.onCursorChange.emit(cursorType);
  }


  private onMouseMove(func: Function): void {
    const removeMousemoveListener = this.renderer.listen('document', 'mousemove', (mousemoveEvent: MouseEvent) => func(mousemoveEvent));

    const removeMouseUpListener = this.renderer.listen('document', 'mouseup', () => {
      removeMousemoveListener();
      removeMouseUpListener();

      if (this.cursorChanged) {
        this.cursorChanged = false;
        this.onCursorChange.emit();
      }
    });
  }


  public override close(): void {
    super.close();

    if (this.maximized) {
      this.renderer.setStyle(this.body, 'overflow', 'auto');
      this.maximized = false;
    }
  }
}