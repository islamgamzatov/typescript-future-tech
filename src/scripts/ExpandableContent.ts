import pxToRem from "./utils/pxToRem";

const rootSelector = "[data-js-expandable-content]";

class ExpandableContent {
  private rootElement: HTMLElement;
  private buttonElement: HTMLButtonElement | null;

  private readonly selectors = {
    root: rootSelector,
    button: "[data-js-expandable-content-button]",
  };

  private readonly stateClasses = {
    isExpanded: "is-expanded",
  };

  private readonly animationParams = {
    duration: 500,
    easing: "ease" as const,
  };

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.buttonElement = this.rootElement.querySelector<HTMLButtonElement>(this.selectors.button);
    this.bindEvents();
  }

  private expand(): void {
    const { offsetHeight, scrollHeight } = this.rootElement;

    this.rootElement.classList.add(this.stateClasses.isExpanded);

    this.rootElement.animate(
      [{ maxHeight: `${pxToRem(offsetHeight)}rem` }, { maxHeight: `${pxToRem(scrollHeight)}rem` }],
      this.animationParams
    );
  }

  private onButtonClick = (): void => {
    this.expand();
  };

  private bindEvents(): void {
    this.buttonElement?.addEventListener("click", this.onButtonClick);
  }
}

// Класс для инициализации всех раскрывающихся блоков на странице
class ExpandableContentCollection {
  constructor() {
    this.init();
  }

  private init(): void {
    const elements = document.querySelectorAll<HTMLElement>(rootSelector);
    elements.forEach((element) => {
      new ExpandableContent(element);
    });
  }
}

export default ExpandableContentCollection;
