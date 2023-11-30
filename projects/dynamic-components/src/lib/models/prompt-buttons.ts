import { Button } from "./button";

/**
 * Represents the configuration for buttons in a prompt window.
 */
export interface PromptButtons {
    /**
     * The primary button configuration.
     */
    primaryButton: Button;
    /**
     * An optional secondary button configuration.
     */
    secondaryButton?: Button;
    /**
     * An optional tertiary button configuration.
     */
    tertiaryButton?: Button;
  }