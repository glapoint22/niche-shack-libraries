import { PromptButton } from "./prompt-button";

/**
 * Represents the configuration for buttons in a prompt window.
 */
export interface PromptButtons {
    /**
     * The primary button configuration.
     */
    primaryButton?: PromptButton;
    /**
     * An optional secondary button configuration.
     */
    secondaryButton?: PromptButton;
    /**
     * An optional tertiary button configuration.
     */
    tertiaryButton?: PromptButton;
  }