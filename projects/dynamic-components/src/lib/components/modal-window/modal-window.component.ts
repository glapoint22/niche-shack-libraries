import { Component, HostListener, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWindowContentComponent } from '../../models/modal-window-content-component';
import { ContentHostComponent } from '../../models/content-host-component';
import { IModalWindowComponent } from '../../interfaces/i-modal-window-component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-modal-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-window.component.html'
})
export class ModalWindowComponent<T extends ModalWindowContentComponent> extends ContentHostComponent<T> implements IModalWindowComponent<T> {
  protected hidden!: boolean;
  protected title!: string;


  // Closed
  private _closed!: boolean;
  public get closed(): boolean {
    return this._closed;
  }


  private onHideSubscription!: Subscription;


  public init(contentComponentType: Type<T>, title: string): void {
    this.setContent(contentComponentType);
    this.setTitle(title);
  }


  public override close(): void {
    this._closed = true;

    super.close();
  }



  private setTitle(title: string): void {
    this.title = title;
  }




  protected override createContentComponent(): void {
    super.createContentComponent();

    this.onHideSubscription = this.contentComponent.onHide.subscribe((value: boolean) => this.hidden = value);
  }




  @HostListener('document:keydown', ['$event'])
  private onKeyPress(event: KeyboardEvent): void {

    // Check if the pressed key is the 'Escape' key.
    if (event.key === 'Escape' && !this.hidden) {
      this.close();
    }
  }


  protected override ngOnDestroy(): void {
    super.ngOnDestroy();

    // Unsubscribe from the 'onHide' event if a subscription exists and is not closed
    if (this.onHideSubscription && !this.onHideSubscription.closed) {
      this.onHideSubscription.unsubscribe();
    }
  }
}