import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { WindowContainerComponent } from '../../components/window-container/window-container.component';
import { ModalWindowContainerComponent } from '../../components/modal-window-container/modal-window-container.component';
import { PopupContainerComponent } from '../../components/popup-container/popup-container.component';
import { MenuContainerComponent } from '../../components/menu-container/menu-container.component';
import { ModalWindowContentComponent } from '../../models/modal-window-content-component';
import { IModalWindowComponent } from '../../interfaces/i-modal-window-component';
import { take } from 'rxjs';
import { ContentComponent } from '../../models/content-component';
import { Rect } from '../../models/rect';
import { IWindowComponent } from '../../interfaces/i-window-component';
import { IPopupComponent } from '../../interfaces/i-popup-component';
import { IMenu } from '../../interfaces/i-menu';
import { Position } from '../../models/position';
import { IMenuComponent } from '../../interfaces/i-menu-component';
import { PromptButtons } from '../../models/prompt-buttons';
import { IPromptComponent } from '../../interfaces/i-prompt-component';
import { PromptComponent } from '../../components/prompt/prompt.component';
import { AnchorPoint } from '../../enums/anchor-point';
import { MenuComponent } from '../../components/menu/menu.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  private windowContainer!: WindowContainerComponent<any>;
  private modalWindowContainer!: ModalWindowContainerComponent<any>;
  private popupContainer!: PopupContainerComponent<any>;
  private menuContainer!: MenuContainerComponent;

  private isWindowContainerCreated!: boolean;
  private isModalWindowContainerCreated!: boolean;
  private isPopupContainerCreated!: boolean;
  private isMenuContainerCreated!: boolean;

  private containerRef!: ViewContainerRef;

  public setContainerRef(containerRef: ViewContainerRef) {
    this.containerRef = containerRef;
  }


  private async createWindowContainer() {
    if (!this.isWindowContainerCreated) {
      this.isWindowContainerCreated = true;
      const { WindowContainerComponent } = await import('../../components/window-container/window-container.component');
      const componentRef = this.containerRef.createComponent(WindowContainerComponent);

      componentRef.changeDetectorRef.detectChanges();
      this.windowContainer = componentRef.instance;
    }
  }


  private async createModalWindowContainer() {
    if (!this.isModalWindowContainerCreated) {
      this.isModalWindowContainerCreated = true;
      const { ModalWindowContainerComponent: ModalWindowContainerComponent } = await import('../../components/modal-window-container/modal-window-container.component');
      const componentRef = this.containerRef.createComponent(ModalWindowContainerComponent);
      
      componentRef.changeDetectorRef.detectChanges();
      this.modalWindowContainer = componentRef.instance;
    }
  }


  private async createPopupContainer() {
    if (!this.isPopupContainerCreated) {
      this.isPopupContainerCreated = true;
      const { PopupContainerComponent } = await import('../../components/popup-container/popup-container.component');
      const componentRef = this.containerRef.createComponent(PopupContainerComponent);

      componentRef.changeDetectorRef.detectChanges();
      this.popupContainer = componentRef.instance;
    }
  }


  private async createMenuContainer() {
    if (!this.isMenuContainerCreated) {
      this.isMenuContainerCreated = true;
      const { MenuContainerComponent } = await import('../../components/menu-container/menu-container.component');
      const componentRef = this.containerRef.createComponent(MenuContainerComponent);

      componentRef.changeDetectorRef.detectChanges();
      this.menuContainer = componentRef.instance;
    }
  }





  /**
     * Asynchronously creates a modal window component based on provided parameters.
     * @param contentType - The type of modal window content component.
     * @param title - The title of the modal window.
     * @returns A Promise resolving to an instance of IModalWindowComponent representing the created modal window component.
     */
  public async createModalWindow<T extends ModalWindowContentComponent>(contentType: Type<T>, title: string): Promise<IModalWindowComponent<T>> {
    await this.createModalWindowContainer();

    const { ModalWindowComponent } = await import('../../components/modal-window/modal-window.component');
    const modalWindow = this.modalWindowContainer.create(ModalWindowComponent);

    modalWindow.init(contentType, title);

    return new Promise<IModalWindowComponent<T>>((resolve) => {
      modalWindow.onContentCreated
        .pipe(take(1))
        .subscribe(() => {
          resolve(modalWindow);
        });
    });
  }



  /**
       * Asynchronously creates a window component based on provided parameters.
       * @param contentType - The type of content component to be displayed in the window.
       * @param title - The title of the window.
       * @param rect - The dimensions and position of the window.
       * @returns A Promise resolving to an instance of IWindowComponent representing the created window component.
       */
  public async createWindow<T extends ContentComponent>(contentType: Type<T>, title: string, rect: Rect): Promise<IWindowComponent<T>> {
    await this.createWindowContainer();

    const { WindowComponent } = await import('../../components/window/window.component');
    const window = this.windowContainer.create(WindowComponent);

    window.init(contentType, title, rect);

    return new Promise<IWindowComponent<T>>((resolve) => {
      window.onContentCreated
        .pipe(take(1))
        .subscribe(() => {
          resolve(window);
        });
    });
  }


  /**
       * Asynchronously creates a popup component based on provided parameters.
       * @param contentType - The type of content component for the popup.
       * @param target - The target HTMLElement to position the popup.
       * @param anchorPoint - The anchor point for positioning the popup relative to the target.
       * @returns A Promise resolving to an instance of IPopupComponent representing the created popup component.
       */
  public async createPopup<T extends ContentComponent>(contentType: Type<T>, target: HTMLElement, anchorPoint: AnchorPoint): Promise<IPopupComponent<T>> {
    await this.createPopupContainer();

    const { PopupComponent } = await import('../../components/popup/popup.component');
    const popup = this.popupContainer.create(PopupComponent);

    popup.init(contentType, target, anchorPoint);

    return new Promise<IPopupComponent<T>>((resolve) => {
      popup.onContentCreated
        .pipe(take(1))
        .subscribe(() => {
          resolve(popup);
        });
    });
  }



  /**
       * Asynchronously creates a menu component based on provided parameters.
       * @param menu - The menu object to create the component from.
       * @param position - The position to place the menu component.
       * @returns A Promise resolving to an instance of IMenuComponent representing the created menu component.
       */
  public async createMenu(menu: IMenu, position: Position): Promise<IMenuComponent> {
    await this.createMenuContainer();

    const { MenuComponent } = await import('../../components/menu/menu.component');
    const menuComponent: MenuComponent = this.menuContainer.create(MenuComponent);

    menuComponent.init(menu, position);
    return menuComponent as IMenuComponent;
  }



  /**
   * Creates a prompt with the specified title, message, and buttons.
   * @param title - The title of the prompt window.
   * @param message - The message to display in the prompt window.
   * @param buttons - The buttons configuration for the prompt window.
   * @returns A Promise resolving to the modal window component containing the prompt component.
   */
  public async createPrompt(title: string, message: string, buttons: PromptButtons): Promise<IModalWindowComponent<IPromptComponent>> {
    await this.createModalWindowContainer();
    const { PromptComponent } = await import('../../components/prompt/prompt.component');

    return new Promise<IModalWindowComponent<PromptComponent>>(async (resolve) => {
      this.createModalWindow(PromptComponent, title)
        .then(modalWindow => {
          const prompt = modalWindow.contentComponent;
          prompt.init(message, buttons);
          resolve(modalWindow);
        });
    });
  }
}