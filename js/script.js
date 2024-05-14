import { Slide, SlideNav } from "./modules/slide.js";

const slide = new SlideNav(".slide", ".slide-wraper");
slide.init();
slide.addArrow(".prev", ".next");
console.log(slide);
