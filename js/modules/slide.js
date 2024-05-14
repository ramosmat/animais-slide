export default class Slide {
  constructor(slide, wraper) {
    this.slide = document.querySelector(slide);
    this.wraper = document.querySelector(wraper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3D(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.3;
    return this.dist.finalPosition - this.dist.movement;
  }

  //Evento que será executado quando o usuário clicar na imagem
  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.clientX;
    this.wraper.addEventListener("mousemove", this.onMove);
  }

  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    this.wraper.removeEventListener("mousemove", this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    this.wraper.addEventListener("mousedown", this.onStart);
    this.wraper.addEventListener("mouseup", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
