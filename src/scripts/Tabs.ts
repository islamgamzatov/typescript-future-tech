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
    this.state = {
      activeTabIndex: Array.from(this.buttonElements).findIndex((buttonElement) => 
      buttonElement.classList.contains(this.stateClasses.isActive)
    )
    };
    this.limitTabsIndex = this.buttonElements.length - 1;
    this.bindEvents();
  }

  private updateUI(): void {
    const { activeTabIndex } = this.state;

    this.buttonElements.forEach((buttonElement, index): void => {
      const isActive: boolean = index === activeTabIndex;
      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
    });

    this.contentElements.forEach((contentElement, index): void => {
      const isActive: boolean = index === activeTabIndex;
      contentElement.classList.toggle(this.stateClasses.isActive, isActive);
    });
  }

  private onButtonClick(buttonIndex: number): void {
    this.state.activeTabIndex = buttonIndex;
    this.updateUI();
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