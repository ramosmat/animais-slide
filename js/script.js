import Slide from "./modules/slide.js";

const slide = new Slide(".slide", ".slide-wraper");
slide.init();
console.log(slide);

slide.changeSlide(3);
slide.activePrevSlide();
