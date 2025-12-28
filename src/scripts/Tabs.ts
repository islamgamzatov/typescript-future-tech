const rootSelector = "[data-js-tabs]";

class Tabs {
  private rootElement: HTMLElement;
  private buttonElements: NodeListOf<HTMLElement>;
  private contentElements: NodeListOf<HTMLElement>;
  private state: { activeTabIndex: number };
  private limitTabsIndex: number;

  private readonly selectors = {
    root: rootSelector,
    button: "[data-js-tabs-button]",
    content: "[data-js-tabs-content]",
  };

  private readonly stateClasses = {
    isActive: "is-active",
  };

  private readonly stateAttributes = {
    ariaSelected: "aria-selected",
    tabIndex: "tabindex",
  };

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.buttonElements = this.rootElement.querySelectorAll<HTMLElement>(this.selectors.button);
    this.contentElements = this.rootElement.querySelectorAll<HTMLElement>(this.selectors.content);
    const activeIndex = Array.from(this.buttonElements).findIndex((buttonElement) => 
      buttonElement.classList.contains(this.stateClasses.isActive)
    );
    this.state = {
      activeTabIndex: activeIndex
    };
    this.limitTabsIndex = this.buttonElements.length - 1;
    this.bindEvents();
  }

  bindEvents(): void {
    this.buttonElements.forEach((buttonElement: HTMLElement, index: number): void => {
      buttonElement.addEventListener('click', () => this.onButtonClick(index));
    });
  }
}

// Класс для инициализации логики всех табов на одной странице
class TabsCollection {
  constructor() {
    this.init();
  }

  private init(): void {
    const elements = document.querySelectorAll<HTMLElement>(rootSelector);
    elements.forEach((element) => {
      new Tabs(element);
    });
  }
}

export default TabsCollection;