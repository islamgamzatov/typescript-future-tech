abstract class BaseComponent<T extends object> {
  constructor() {
    if (this.constructor === BaseComponent) {
      throw new Error("Невозможно создать экземпляр абстрактного класса BaseComponent!");
    }
  }

  protected getProxyState(initialState: T): T {
    return new Proxy(initialState, {
      get: (target: T, prop: string | symbol): any => {
        return target[prop as keyof T];
      },
      set: (target: T, prop: string | symbol, newValue: any): boolean => {
        const key = prop as keyof T;
        const oldValue = target[key];

        if (newValue === oldValue) {
          return true;
        }

        target[key] = newValue;

        this.updateUI();

        return true;
      },
    });
  }

  protected updateUI(): void {
    throw new Error("Необходимо реализовать метод updateUI!");
  }
}

export default BaseComponent;
