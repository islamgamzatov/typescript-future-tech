const rootSelector = "[data-js-video-player]";

class VideoPlayer {
  private rootElement: HTMLElement;
  private videoElement: HTMLVideoElement | null;
  private panelElement: HTMLElement | null;
  private playButtonElement: HTMLButtonElement | null;

  private readonly selectors = {
    root: rootSelector,
    video: "[data-js-video-player-video]",
    panel: "[data-js-video-player-panel]",
    playButton: "[data-js-video-player-play-button]",
  };

  private readonly stateClasses = {
    isActive: "is-active",
  };

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.videoElement = this.rootElement.querySelector<HTMLVideoElement>(this.selectors.video);
    this.panelElement = this.rootElement.querySelector<HTMLElement>(this.selectors.panel);
    this.playButtonElement = this.rootElement.querySelector<HTMLButtonElement>(
      this.selectors.playButton
    );
    this.bindEvents();
  }

  private onPlayButtonClick = (): void => {
    if (!this.videoElement || !this.panelElement) {
      return;
    }

    this.videoElement.play();
    this.videoElement.controls = true;
    this.panelElement.classList.remove(this.stateClasses.isActive);
  };

  private onVideoPause = (): void => {
    if (!this.videoElement || !this.panelElement) {
      return;
    }

    this.videoElement.controls = false;
    this.panelElement.classList.add(this.stateClasses.isActive);
  };

  private bindEvents(): void {
    this.playButtonElement?.addEventListener("click", this.onPlayButtonClick);
    this.videoElement?.addEventListener("pause", this.onVideoPause);
  }
}

// Класс для инициализации логики всех видеоплееров на одной странице.
class VideoPlayerCollection {
  constructor() {
    this.init();
  }

  private init(): void {
    const elements = document.querySelectorAll<HTMLElement>(rootSelector);
    elements.forEach((element: HTMLElement) => {
      new VideoPlayer(element);
    });
  }
}

export default VideoPlayerCollection;
