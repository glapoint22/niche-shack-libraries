import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWindowContentComponent } from '../../models/modal-window-content-component';
import { IPromptComponent } from '../../interfaces/i-prompt-component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromptButton } from '../../models/prompt-button';
import { PromptButtons } from '../../models/prompt-buttons';

@Component({
  selector: 'ns-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent extends ModalWindowContentComponent implements IPromptComponent {
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  protected message!: SafeHtml;
  protected primaryButton?: PromptButton;
  protected secondaryButton?: PromptButton;
  protected tertiaryButton?: PromptButton;

  public init(message: string, buttons: PromptButtons): void {
    this.message = this.sanitizer.bypassSecurityTrustHtml(message);
    this.primaryButton = buttons.primaryButton;
    this.secondaryButton = buttons.secondaryButton;
    this.tertiaryButton = buttons.tertiaryButton;
  }
}