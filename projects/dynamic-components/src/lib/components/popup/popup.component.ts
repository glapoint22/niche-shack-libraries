import { Component, ElementRef, HostListener, Type, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from '../../models/content-component';
import { ContentHostComponent } from '../../models/content-host-component';
import { IContentHostComponent } from '../../interfaces/i-content-host-component';
import { AnchorPoint } from '../../enums/anchor-point';
import { take } from 'rxjs';
import { Rect } from '../../models/rect';
import { Position } from '../../models/position';

@Component({
  selector: 'ns-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html'
})
export class PopupComponent<T extends ContentComponent> extends ContentHostComponent<T> implements IContentHostComponent<T> {
  @ViewChild('popup') private popup!: ElementRef<HTMLElement>;

  protected arrowLeft!: number;
  protected arrowTop!: number;
  protected arrowBottom!: number;
  protected arrowRight!: number;
  protected arrowRotation!: number;

  public init(contentComponentType: Type<T>, target: HTMLElement, anchorPoint: AnchorPoint) {
    this.setContent(contentComponentType);

    this.onOpen
      .pipe(take(1))
      .subscribe(() => this.setPosition(target, anchorPoint));
  }


  private setPosition(target: HTMLElement, anchorPoint: AnchorPoint): void {
    this.rect = Rect.create(this.popup.nativeElement);

    // Set the position based on the target and the anchor point
    let position: Position = this.getPopupPosition(this.rect, target, anchorPoint);
    this.rect.setPosition(position);

    if (this.isAnchorPointOutOfBounds(anchorPoint, this.rect)) {
      // Reset the anchor point and popup position
      anchorPoint = this.mirrorAnchorPoint(anchorPoint);

      position = this.getPopupPosition(this.rect, target, anchorPoint);
      this.rect.setPosition(position);
    }

    // Make sure popup is in bounds
    this.rect = this.keepPopupInBounds(this.rect);

    // Set the arrow rotation
    this.setArrowRotation(anchorPoint);

    // Set the arrow position
    this.setArrowPosition(anchorPoint, target, this.rect);
  }


  private isAnchorPointOutOfBounds(anchorPoint: AnchorPoint, popupRect: Rect): boolean {
    // Check if the anchor point is at the top and if the popup would extend above the top of the window
    const isTopCheck = this.isTopAnchorPoint(anchorPoint) && popupRect.extendsWindowTop;

    // Check if the anchor point is on the right and if the popup would extend beyond the right side of the window
    const isRightCheck = this.isRightAnchorPoint(anchorPoint) && popupRect.extendsWindowRight;

    // Check if the anchor point is at the bottom and if the popup would extend beyond the bottom of the window
    const isBottomCheck = this.isBottomAnchorPoint(anchorPoint) && popupRect.extendsWindowBottom;

    // Check if the anchor point is on the left and if the popup would extend beyond the left side of the window
    const isLeftCheck = this.isLeftAnchorPoint(anchorPoint) && popupRect.extendsWindowLeft;

    return isBottomCheck || isTopCheck || isRightCheck || isLeftCheck;
  }




  private keepPopupInBounds(popupRect: Rect): Rect {
    // If the top edge of the popup goes beyond the top edge of the window, adjust its position.
    if (popupRect.extendsWindowTop) {
      popupRect.positionWindowTop();
    }


    // If the right edge of the popup goes beyond the right edge of the window, adjust its position.
    if (popupRect.extendsWindowRight) {
      popupRect.positionWindowRight();
    }


    // If the bottom edge of the popup goes beyond the bottom edge of the window, adjust its position.
    if (popupRect.extendsWindowBottom) {
      popupRect.positionWindowBottom();
    }


    // If the left edge of the popup goes beyond the left edge of the window, adjust its position.
    if (popupRect.extendsWindowLeft) {
      popupRect.positionWindowLeft();
    }


    // Return the adjusted position.
    return popupRect;
  }



  private setArrowPosition(anchorPoint: AnchorPoint, target: HTMLElement, popupRect: Rect): void {
    // Define the dimensions of the arrow.
    const arrowWidth: number = 13;
    const arrowHeight: number = 7;

    // Define vertical and horizontal offsets for positioning the arrow.
    const verticalOffset = -12;
    const horizontalOffset = -18;

    // If the anchor point is at the top or bottom of the target element.
    if (this.isTopAnchorPoint(anchorPoint) || this.isBottomAnchorPoint(anchorPoint)) {
      // Calculate the horizontal position of the arrow based on the center of the target element.
      const targetCenter = target.offsetLeft - this.getScrollLeft(target) + target.offsetWidth * 0.5;
      this.arrowLeft = targetCenter - popupRect.x - arrowWidth;

      // If the anchor point is at the top, set the bottom position of the arrow.
      if (this.isTopAnchorPoint(anchorPoint)) this.arrowBottom = verticalOffset;

      // If the anchor point is at the bottom, set the top position of the arrow.
      if (this.isBottomAnchorPoint(anchorPoint)) this.arrowTop = verticalOffset;
    }

    // If the anchor point is on the left or right of the target element.
    if (this.isLeftAnchorPoint(anchorPoint) || this.isRightAnchorPoint(anchorPoint)) {
      // Calculate the vertical position of the arrow based on the center of the target element.
      const targetCenter = target.offsetTop - this.getScrollTop(target) + target.offsetHeight * 0.5;
      this.arrowTop = targetCenter - popupRect.y - arrowHeight;

      // If the anchor point is on the left, set the right position of the arrow.
      if (this.isLeftAnchorPoint(anchorPoint)) this.arrowRight = horizontalOffset;

      // If the anchor point is on the right, set the left position of the arrow.
      if (this.isRightAnchorPoint(anchorPoint)) this.arrowLeft = horizontalOffset;
    }
  }



  private setArrowRotation(anchorPoint: AnchorPoint): void {
    // If the anchor point is at the bottom, set the arrow rotation to 0 degrees.
    if (this.isBottomAnchorPoint(anchorPoint)) {
      this.arrowRotation = 0;
    }

    // If the anchor point is on the left, set the arrow rotation to 90 degrees.
    if (this.isLeftAnchorPoint(anchorPoint)) {
      this.arrowRotation = 90;
    }

    // If the anchor point is at the top, set the arrow rotation to 180 degrees.
    if (this.isTopAnchorPoint(anchorPoint)) {
      this.arrowRotation = 180;
    }

    // If the anchor point is on the right, set the arrow rotation to 270 degrees.
    if (this.isRightAnchorPoint(anchorPoint)) {
      this.arrowRotation = 270;
    }
  }


  private getPopupPosition(popupRect: Rect, target: HTMLElement, anchorPoint: AnchorPoint): Position {
    const arrowSize: number = 13;
    const arrowOffset: number = 15;
    const positionOffset: number = 5;
    const horizontalCenter: number = -popupRect.width * 0.5 + target.offsetWidth * 0.5;
    const horizontalTop: number = -popupRect.height - arrowSize - positionOffset;
    const horizontalLeft: number = -popupRect.width + arrowSize + arrowOffset + target.offsetWidth * 0.5;
    const horizontalRight: number = -arrowSize - arrowOffset + target.offsetWidth * 0.5;
    const verticalRight: number = target.offsetWidth + arrowSize + positionOffset;
    const verticalTop: number = -popupRect.height + arrowSize + arrowOffset + target.offsetHeight * 0.5;
    const verticalMiddle: number = -popupRect.height * 0.5 + target.offsetHeight * 0.5;
    const verticalBottom: number = -arrowSize - arrowOffset + target.offsetHeight * 0.5;
    const verticalLeft: number = -popupRect.width - arrowSize - positionOffset;
    const horizontalBottom: number = arrowSize + positionOffset + target.offsetHeight;

    const offsetMap: Record<AnchorPoint, [number, number]> = {
      [AnchorPoint.TopCenter]: [horizontalCenter, horizontalTop],
      [AnchorPoint.TopLeft]: [horizontalLeft, horizontalTop],
      [AnchorPoint.TopRight]: [horizontalRight, horizontalTop],
      [AnchorPoint.RightTop]: [verticalRight, verticalTop],
      [AnchorPoint.RightMiddle]: [verticalRight, verticalMiddle],
      [AnchorPoint.RightBottom]: [verticalRight, verticalBottom],
      [AnchorPoint.LeftTop]: [verticalLeft, verticalTop],
      [AnchorPoint.LeftMiddle]: [verticalLeft, verticalMiddle],
      [AnchorPoint.LeftBottom]: [verticalLeft, verticalBottom],
      [AnchorPoint.BottomCenter]: [horizontalCenter, horizontalBottom],
      [AnchorPoint.BottomRight]: [horizontalRight, horizontalBottom],
      [AnchorPoint.BottomLeft]: [horizontalLeft, horizontalBottom],
    };

    const [offsetX, offsetY] = offsetMap[anchorPoint];
    const x = target.offsetLeft - this.getScrollLeft(target) + offsetX;
    const y = target.offsetTop - this.getScrollTop(target) + offsetY;

    return Position.create(x, y);
  }

  private getScrollTop(target: HTMLElement) {
    let scrollTop = 0;

    target = target.parentElement as HTMLElement;

    while (target && target.tagName.toLowerCase() !== 'html') {
      scrollTop += target.scrollTop;
      target = target.parentElement as HTMLElement;
    }

    return scrollTop;
  }


  private getScrollLeft(target: HTMLElement) {
    let scrollLeft = 0;

    target = target.parentElement as HTMLElement;

    while (target && target.tagName.toLowerCase() !== 'html') {
      scrollLeft += target.scrollLeft;
      target = target.parentElement as HTMLElement;
    }

    return scrollLeft;
  }

  private mirrorAnchorPoint(anchorPoint: AnchorPoint): AnchorPoint {
    const anchorMap: Record<AnchorPoint, AnchorPoint> = {
      [AnchorPoint.BottomCenter]: AnchorPoint.TopCenter,
      [AnchorPoint.BottomRight]: AnchorPoint.TopRight,
      [AnchorPoint.BottomLeft]: AnchorPoint.TopLeft,
      [AnchorPoint.LeftBottom]: AnchorPoint.RightBottom,
      [AnchorPoint.LeftMiddle]: AnchorPoint.RightMiddle,
      [AnchorPoint.LeftTop]: AnchorPoint.RightTop,
      [AnchorPoint.RightBottom]: AnchorPoint.LeftBottom,
      [AnchorPoint.RightMiddle]: AnchorPoint.LeftMiddle,
      [AnchorPoint.RightTop]: AnchorPoint.LeftTop,
      [AnchorPoint.TopCenter]: AnchorPoint.BottomCenter,
      [AnchorPoint.TopLeft]: AnchorPoint.BottomLeft,
      [AnchorPoint.TopRight]: AnchorPoint.BottomRight,
    };

    return anchorMap[anchorPoint];
  }

  private isTopAnchorPoint(anchorPoint: AnchorPoint): boolean {
    return anchorPoint === AnchorPoint.TopLeft ||
      anchorPoint === AnchorPoint.TopCenter ||
      anchorPoint === AnchorPoint.TopRight;
  }

  private isRightAnchorPoint(anchorPoint: AnchorPoint): boolean {
    return anchorPoint === AnchorPoint.RightTop ||
      anchorPoint === AnchorPoint.RightMiddle ||
      anchorPoint === AnchorPoint.RightBottom;
  }

  private isBottomAnchorPoint(anchorPoint: AnchorPoint): boolean {
    return anchorPoint === AnchorPoint.BottomLeft ||
      anchorPoint === AnchorPoint.BottomCenter ||
      anchorPoint === AnchorPoint.BottomRight;
  }

  private isLeftAnchorPoint(anchorPoint: AnchorPoint): boolean {
    return anchorPoint === AnchorPoint.LeftTop ||
      anchorPoint === AnchorPoint.LeftMiddle ||
      anchorPoint === AnchorPoint.LeftBottom;
  }


  @HostListener('document:keydown', ['$event'])
  protected onKeyPress(event: KeyboardEvent): void {

    // Check if the pressed key is the 'Escape' key.
    if (event.key === 'Escape') {
      this.close();
    }
  }
}