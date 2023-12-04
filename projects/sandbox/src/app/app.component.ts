import { Component, ViewContainerRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DynamicComponentService, PromptButton } from 'dynamic-components';

@Component({
  selector: 'ns-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private containerRef = inject(ViewContainerRef);
  private dynamicComponentService = inject(DynamicComponentService);

  ngOnInit() {
    this.dynamicComponentService.setContainerRef(this.containerRef);

    this.dynamicComponentService.createPrompt('My Prompt', 'This is my message to all!', {
      primaryButton: PromptButton.create('Ok', () => console.log('Ok')),
      secondaryButton: PromptButton.create('Cancel')
    });
  }
}