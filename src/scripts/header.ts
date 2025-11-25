class Header {
  selectors = {
    root: "[data-js-header]",
    overlay: "[data-js-header-overlay]",
    burgerButton: "[data-js-header-burger-button]",
  };

  stateClasses = {
    isActive: "is-active",
    isLock: "is-lock",
  };

  rootElement: HTMLElement;
  overlayElement: HTMLElement;
  burgerButtonElement: HTMLElement;

  onBurgerButtonClick = (): void => {
    this.burgerButtonElement.classList.toggle(this.stateClasses.isActive);
    this.overlayElement.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root) as HTMLElement;
    this.overlayElement = this.rootElement.querySelector(this.selectors.overlay) as HTMLElement;
    this.burgerButtonElement = this.rootElement.querySelector(
      this.selectors.burgerButton
    ) as HTMLElement;

    this.bindEvents();
  }

  bindEvents(): void {
    this.burgerButtonElement.addEventListener("click", this.onBurgerButtonClick);
  }
}

export default Header;
