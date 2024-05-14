import debounce from "./debouce.js";

export default class Slide {
  constructor(slide, wraper) {
    this.slide = document.querySelector(slide);
    this.wraper = document.querySelector(wraper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
    this.activeClass = "active";
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  //Evento que será executado quando o usuário clicar e mover a imagem
  //Verifica se o tipo de evento é feito pelo computador ou celular e chama a onMove
  onStart(event) {
    let moveType;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }
    this.wraper.addEventListener(moveType, this.onMove);
    this.transition(false);
  }

  //Evento que é executado sempre que o usuário movimentar o mouse
  //Pega a posição do clique de acordo com o tipo de evento
  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  //Evento que é executado pelo onMove para atualizar a posição do slide
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.3;
    return this.dist.finalPosition - this.dist.movement;
  }

  //Evento que é executado pelo onMove para aplicar o movimento do slide
  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3D(${distX}px, 0, 0)`;
  }

  //Evento que é executado quando o usuário soltar o clique do mouse
  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wraper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  changeActiveClass() {
    this.slideArray.forEach((item) => {
      item.element.classList.remove(this.activeClass);
    });
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  //Calcula e coloca a imagem exatamente no centro da tela
  slidePosition(slide) {
    const margin = (this.wraper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  //Separa cada elemento e sua posição inicial dentro de um objeto
  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        element,
        position,
      };
    });
  }

  //Cria e define um objeto index que contem o index da imagem atual, anterior e próxima
  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index === 0 ? undefined : index - 1,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  //Pega a posição do slide atual e usa em outras funções
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  addSlideEvents() {
    this.wraper.addEventListener("mousedown", this.onStart);
    this.wraper.addEventListener("touchstart", this.onStart);
    this.wraper.addEventListener("touchend", this.onEnd);
    this.wraper.addEventListener("mouseup", this.onEnd);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    return this;
  }
}
