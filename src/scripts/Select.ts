import BaseComponent from "./BaseComponent.ts";
import MatchMedia from "./MatchMedia.ts";

const rootSelector = "[data-js-select]";

interface SelectState {
  isExpanded: boolean;
  currentOptionIndex: number | null;
  selectedOptionElement: HTMLElement | null;
}

class Select extends BaseComponent<SelectState> {
  private rootElement: HTMLElement;
  private originalControlElement: HTMLSelectElement;
  private buttonElement: HTMLElement;
  private dropdownElement: HTMLElement;
  private optionsElements: NodeListOf<HTMLElement>;

  private state: {
    isExpanded: boolean;
    currentOptionIndex: number | null;
    selectedOptionElement: HTMLElement | null;
  };

  private readonly selectors = {
    root: rootSelector,
    originalControl: "[data-js-select-original-control]",
    button: "[data-js-select-button]",
    dropdown: "[data-js-select-dropdown]",
    option: "[data-js-select-option]",
  };

  private readonly stateClasses = {
    isExpanded: "is-expanded",
    isSelected: "is-selected",
    isCurrent: "is-current",
    isOnTheLeftSide: "is-on-the-left-side",
    isOnTheRightSide: "is-on-the-right-side",
  };

  private readonly stateAttributes = {
    ariaExpanded: "aria-expanded",
    ariaSelected: "aria-selected",
    ariaActiveDescendant: "aria-activedescendant",
  };

  private readonly initialState = {
    isExpanded: false,
    currentOptionIndex: null,
    selectedOptionElement: null,
  };

  constructor(rootElement: HTMLElement) {
    super();
    this.rootElement = rootElement;
    this.originalControlElement = this.rootElement.querySelector(
      this.selectors.originalControl
    ) as HTMLSelectElement;
    this.buttonElement = this.rootElement.querySelector(this.selectors.button) as HTMLElement;
    this.dropdownElement = this.rootElement.querySelector(this.selectors.dropdown) as HTMLElement;
    this.optionsElements = this.dropdownElement.querySelectorAll(
      this.selectors.option
    ) as NodeListOf<HTMLElement>;
    // При каждом обращении к свойству объекта state (при каждом внисении изменения в объект состояния) мы будем вызывать метод updateUI, который будет отвечать за перересовку всего, что нам нужно (обновлять нам DOM-элементах CSS классы, значения HTML атрибутов и textContent у элемента select__button, когда пользователь выбрал в селекте новое значение).
    this.state = this.getProxyState({
      ...this.initialState,
      currentOptionIndex: this.originalControlElement.selectedIndex, // У DOM-элемента селекта есть специальное свойство selectedIndex, возвращаяющее числовое значение - иднекс текущей выбранной опции.
      selectedOptionElement: this.optionsElements[this.originalControlElement.selectedIndex], // Таким образом, selectedOptionElement будет содержать ссылку на DOM-элемент выбранной опции с классом select__option.
    });
    this.fixDropdownPosition();
    this.updateTabIndexes();
    this.bindEvents();
  }

  public updateUI(): void {
    const { isExpanded, currentOptionIndex, selectedOptionElement } = this.state;

    const newSelectedOptionValue = selectedOptionElement?.textContent?.trim() ?? "";

    const updateOriginalControl = () => {
      // Здесь мы будем обновлять значение оригинального селекта, чтобы синхронизировать его с нашим кастомным селектом.
      this.originalControlElement.value = newSelectedOptionValue;
    };

    const updateButton = () => {
      // Здесь мы будем устанавливать значение новой выбранной опции, добавлять/убирать класс is-expanded, обновлять атрибут aria-expanded.
      this.buttonElement.textContent = newSelectedOptionValue;
      this.buttonElement.classList.toggle(this.stateClasses.isExpanded, isExpanded);
      this.buttonElement.setAttribute(this.stateAttributes.ariaExpanded, isExpanded.toString());
      if (currentOptionIndex !== null) {
        this.buttonElement.setAttribute(
          this.stateAttributes.ariaActiveDescendant,
          this.optionsElements[currentOptionIndex].id
        );
      } // Здесь нам нужно указать идентификатор опции, которая выделена сейчас как is-current.
    };

    const updateDropdown = () => {
      this.dropdownElement.classList.toggle(this.stateClasses.isExpanded, isExpanded);
    };

    const updateOptions = () => {
      this.optionsElements.forEach((optionsElement, index) => {
        const isCurrent = currentOptionIndex === index;
        const isSelected = selectedOptionElement === optionsElement;

        optionsElement.classList.toggle(this.stateClasses.isCurrent, isCurrent);
        optionsElement.classList.toggle(this.stateClasses.isSelected, isSelected);
        optionsElement.setAttribute(this.stateAttributes.ariaSelected, isSelected.toString());
      });
    };

    updateOriginalControl();
    updateButton();
    updateDropdown();
    updateOptions();
  }

  private toggleExpandedState(): void {
    this.state.isExpanded = !this.state.isExpanded;
  }

  /*
		Когда dropDown меню открыто, клик вне него должен его закрывать.
		Для этого в теле метода
	*/
  private expand(): void {
    this.state.isExpanded = true; // Устанавлием значнием true, чтобы выпающее меню открывалось
  }

  private collapse(): void {
    this.state.isExpanded = false; // Устанавлием значнием false, чтобы выпающее меню закрывалось
  }

  private fixDropdownPosition(): void {
    const viewportWidth = document.documentElement.clientWidth; // Значение текущей ширины окна.
    const halfViewportX = viewportWidth / 2; // X координата центра текущего Viewport.
    const { width, x } = this.buttonElement.getBoundingClientRect(); // Получаем параметры размеров и координат кнопки относительно viewport.
    const buttonCenterX = x + width / 2; // Получаем координаты центра кнопки по оси X.
    const IsButtonOnTheLeftViewportSide = buttonCenterX < halfViewportX; // Переменная будет содержать булевое значение, определяющее, находится ли кнопка в левой части Viewport или нет.

    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      IsButtonOnTheLeftViewportSide
    );
    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheRightSide,
      !IsButtonOnTheLeftViewportSide
    );
  }

  private updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches): void {
    // Главная фишка matchMedia - возможность подписаться на динамечкское изменение параметров экрана (например, его ширины)
    this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1;
    this.buttonElement.tabIndex = isMobileDevice ? -1 : 0;

    // Все работает отлично, но если пользователь с компьютера ресайзист страницу, то мговенного изменения значения tabindex происходить не будет, поэтому добавим функцию обработчик
  }

  get isNeedToExpand(): boolean {
    // Метод будет проверять, требуется ли сейчас открыть выпадающее меню. Сделаем метод геттером, чтобы им можно было пользоваться без круглых скобок.
    const isButtonFocused = document.activeElement === this.buttonElement;

    return !this.state.isExpanded && isButtonFocused; // Метод isNeedToExpand будет возвращать true только в том случае, если у нас dropdown меню не раскрыто и если в текущий момент в фокусе дом элемент select__button
  }

  selectCurrentOption(): void {
    if (this.state.currentOptionIndex !== null) {
      this.state.selectedOptionElement = this.optionsElements[this.state.currentOptionIndex];
    }
  }

  private onButtonClick = () => {
    this.toggleExpandedState();
  };

  onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement; // target — это свойство объекта события (Event), которое указывает на DOM-элемент, на котором произошло событие.
    const isButtonClick = target === this.buttonElement;
    const isOutSideDropdownClick = target.closest(this.selectors.dropdown) !== this.dropdownElement;

    if (!isButtonClick && isOutSideDropdownClick) {
      this.collapse();
      return;
    }

    const isOptionClick = target.matches(this.selectors.option); // Так мы проверим DOM-элемент, на котором возникло событие клика и если он удовлетворяет переденному в аргументе селектору, то мы можем быть уверенны, что произведен клик по элементу select__option и в target храниться ссылка на одну из таких опций.

    if (isOptionClick) {
      this.state.selectedOptionElement = target;
      // Обернув сущность this.optionsElements в квадратные скобки, мы превращаем структуру nodelist в обычный массив dom-элементов (это нужно для вызова у массива метода findIndex)
      this.state.currentOptionIndex = [...this.optionsElements].findIndex(
        (optionElement) => optionElement === target
      );
      this.collapse();
    }
  };

  onArrowUpOnKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    if (this.state.currentOptionIndex !== null && this.state.currentOptionIndex > 0) {
      this.state.currentOptionIndex--;
    }
  };

  onArrowDownKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    if (
      this.state.currentOptionIndex !== null &&
      this.state.currentOptionIndex < this.optionsElements.length - 1
    ) {
      this.state.currentOptionIndex++;
    }
  };

  onSpaceKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    this.selectCurrentOption();
    this.collapse();
  };

  onEnterKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    this.selectCurrentOption();
    this.collapse();
  };

  onKeyDown = (event: KeyboardEvent) => {
    const { code } = event;

    const action = {
      // В переменной записан объект со свойствами, зимена которых могут совпасть с тем, что приходит у нас в объекте события event и в его поле code.
      ArrowUp: this.onArrowUpOnKeyDown,
      ArrowDown: this.onArrowDownKeyDown,
      Space: this.onSpaceKeyDown,
      Enter: this.onEnterKeyDown,
    }[code]; // Таким образом в переменной action у нас будет храниться либо ссылка на конкретный метод обработчик нажатия на соотвествующую ему клавишу клавиатуры, либо undefined

    if (action) {
      // Истинной сущность будет только в случае, если мы нажали на одну из клавиш клавиатуры, приведенных в этом объекте.
      event.preventDefault();
      action(); // Вызываем функцию action, которая по ссылке вызывает определенный метод.
    }
  };

  private onMobileMatchMediaChange = (event: MediaQueryListEvent) => {
    this.updateTabIndexes(event.matches);
  };

  onOriginalControlChange = () => {
    this.state.selectedOptionElement =
      this.optionsElements[this.originalControlElement.selectedIndex];
  };

  private bindEvents(): void {
    MatchMedia.mobile.addEventListener("change", this.onMobileMatchMediaChange);
    this.buttonElement.addEventListener("click", this.onButtonClick);
    document.addEventListener("click", this.onClick);
    this.rootElement.addEventListener("keydown", this.onKeyDown); // Т.к. мы прицепили слушатель события keydown на rootElement, а не на весь document, мы будет отлавливать только те нажатия клавиш клавиатуры, которые возникают в момент фокусироваки на одном из дочерних элементов нашего дом элемента селекта (оригинальый select и select__button). // Крч. когда у нас фокус на (оригинальый select и select__button) и мы жмем на клавишу нужную, у нас открывается дропдаун (только если изначально он закрытый).
    this.originalControlElement.addEventListener("change", this.onOriginalControlChange);
  }
}

class SelectCollection {
  constructor() {
    this.init();
  }

  private init(): void {
    const elements = document.querySelectorAll<HTMLElement>(rootSelector);
    elements.forEach((element) => {
      new Select(element);
    });
  }
}

export default SelectCollection;
