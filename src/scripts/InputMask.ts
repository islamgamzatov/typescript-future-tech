import IMask from "imask";

const rootSelector = "[data-js-input-mask]";

class InputMask {
  private rootElement: HTMLElement;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.init();
  }

  private init(): void {
    const isLibReady = typeof window.IMask !== "undefined";

    if (isLibReady) {
      window.IMask(this.rootElement, {
        mask: this.rootElement.dataset.jsInputMask,
      });
    } else {
      console.error('Библиотека "imask" не подключена!');
    }
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
