import IMask from "imask"; // Этот импорт ОСТАЕТСЯ

const rootSelector = "[data-js-input-mask]";

class InputMask {
  private rootElement: HTMLElement;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.init();
  }

  private init(): void {
    // Используем импортированный IMask напрямую
    IMask(this.rootElement, {
      mask: this.rootElement.dataset.jsInputMask,
    });
  }
}

class InputMaskCollection {
  constructor() {
    this.init();
  }

  private init(): void {
    document.querySelectorAll(rootSelector).forEach((element: Element) => {
      new InputMask(element as HTMLElement);
    });
  }
}

export default InputMaskCollection;
