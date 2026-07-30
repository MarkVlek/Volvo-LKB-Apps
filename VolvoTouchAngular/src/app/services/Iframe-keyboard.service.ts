import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class IframeKeyBoardService {
  currentFocusEvent: FocusEvent;
  currentFocusEvent$: Subject<FocusEvent> = new Subject<FocusEvent>();
  public showKeyboard: boolean = false;
  private cachedSetter: any = null;
  private cachedWindow: any = null;

  constructor() {
    this.currentFocusEvent$.subscribe(value => {
      this.currentFocusEvent = value;
    })
  }

  dispatchEventToIFrame(value: string) {
    const target = this.currentFocusEvent.target as HTMLInputElement;

    const currentValue = target.value;
    const selectionStart = target.selectionStart ?? currentValue.length;
    const selectionEnd = target.selectionEnd ?? currentValue.length;
    
    const iframeWindow = target.ownerDocument.defaultView as typeof window;

    // Dispatch keydown event first
    const keydownEvent = new iframeWindow.KeyboardEvent("keydown", {
      key: value === "←" ? "Backspace" : value,
      code: value === "←" ? "Backspace" : `Key${value.toUpperCase()}`,
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    target.dispatchEvent(keydownEvent);

    const clonedValue = this.transformKeyValue(
      value,
      currentValue,
      selectionStart,
      selectionEnd
    );

    const isTextarea = target instanceof iframeWindow.HTMLTextAreaElement;
    const nativeValueSetter = Object.getOwnPropertyDescriptor(
      isTextarea ? iframeWindow.HTMLTextAreaElement.prototype : iframeWindow.HTMLInputElement.prototype,
      "value"
    )!.set;

    nativeValueSetter!.call(target, clonedValue);

    const newCursorPos = this.getNewCursorPosition(
      value,
      selectionStart,
      selectionEnd
    );
    
    // Only set selection range for input types that support it
    const supportsSelection = ['text', 'textarea', 'search', 'url', 'tel', 'password'].includes(target.type);
    if (supportsSelection) {
      target.setSelectionRange(newCursorPos, newCursorPos);
    }

    // Create the InputEvent in the iframe's realm too
    const inputEvent = new iframeWindow.InputEvent("input", {
      inputType: value === "←" ? "deleteContentBackward" : "insertText",
      data: value === "←" ? null : value,
      bubbles: true,
      composed: true,
    });

    target.dispatchEvent(inputEvent);

    const keyupEvent = new iframeWindow.KeyboardEvent("keyup", {
      key: value === "←" ? "Backspace" : value,
      code: value === "←" ? "Backspace" : `Key${value.toUpperCase()}`,
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    target.dispatchEvent(keyupEvent);

    const changeEvent = new iframeWindow.Event("change", {
      bubbles: true,
    });
    target.dispatchEvent(changeEvent);

    // Trigger blur and focus to force validation
    const blurEvent = new iframeWindow.FocusEvent("blur", {
      bubbles: true,
    });
    target.dispatchEvent(blurEvent);

    const hasAutocomplete = target.id === 'address-autocomplete_input-input' || 
                        target.id.includes('address-autocomplete');

    if (!hasAutocomplete) {
      // Re-focus immediately to keep keyboard active
      setTimeout(() => {
        const focusEvent = new iframeWindow.FocusEvent("focus", {
          bubbles: true,
        });
        target.dispatchEvent(focusEvent);
        target.focus();
      }, 0);
    }
  }

  transformKeyValue(value: string, currentValue: string, selectionStart: number, selectionEnd: number): string {
    switch (value) {
      case ("←"): // Backspace
        if (selectionStart !== selectionEnd) {
          // Delete selected text
          return currentValue.substring(0, selectionStart) + currentValue.substring(selectionEnd);
        } else if (selectionStart > 0) {
          // Delete character before cursor
          return currentValue.substring(0, selectionStart - 1) + currentValue.substring(selectionStart);
        }
        return currentValue;
      default:
        // Insert text at cursor position
        return currentValue.substring(0, selectionStart) + value + currentValue.substring(selectionEnd);
    }
  }

  private getNewCursorPosition(value: string, selectionStart: number, selectionEnd: number): number {
    if (value === "←") {
      // Backspace: move cursor back one position
      return selectionStart !== selectionEnd ? selectionStart : Math.max(0, selectionStart - 1);
    } else {
      // Insert: move cursor after inserted text
      return selectionStart + value.length;
    }
  }
}