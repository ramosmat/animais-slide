import Slide from "./modules/slide.js";

const slide = new Slide(".slide", ".slide-wraper");
slide.init();

slide.changeSlide(0);
slide.activePrevSlide();
