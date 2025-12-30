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
      ),
    };
    this.limitTabsIndex = this.buttonElements.length - 1;
    this.bindEvents();
  }

  private updateUI(): void {
    const { activeTabIndex } = this.state;

    this.buttonElements.forEach((buttonElement, index): void => {
      const isActive: boolean = index === activeTabIndex;
      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
      buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString());
      buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? "0" : "-1");
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

  private activeTab(newTabIndex: number): void {
    this.state.activeTabIndex = newTabIndex;
    this.buttonElements[newTabIndex].focus();
    this.updateUI();
  }

  private previousTab = (): void => {
    const newTabIndex =
      this.state.activeTabIndex === 0 ? this.limitTabsIndex : this.state.activeTabIndex - 1;

    this.activeTab(newTabIndex);
  };

  private nextTab = (): void => {
    const newTabIndex =
      this.state.activeTabIndex === this.limitTabsIndex ? 0 : this.state.activeTabIndex + 1;

    this.activeTab(newTabIndex);
  };

  private firstTab = (): void => {
    this.activeTab(0);
  };

  private lastTab = (): void => {
    this.activeTab(this.limitTabsIndex);
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    const { code, metaKey } = event;

    const action = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
    }[code];

    const isMacHomeKey = metaKey && code === "ArrowLeft";
    if (isMacHomeKey) {
      this.firstTab();
      return;
    }

    const isMacEndKey = metaKey && code === "ArrowRight";
    if (isMacEndKey) {
      this.lastTab();
      return;
    }

    action?.();
  };

  private bindEvents(): void {
    this.buttonElements.forEach((buttonElement: HTMLElement, index: number): void => {
      buttonElement.addEventListener("click", () => this.onButtonClick(index));
    });
    this.rootElement.addEventListener("keydown", this.onKeyDown);
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
