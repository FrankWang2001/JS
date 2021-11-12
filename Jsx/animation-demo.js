import {Timeline,Animation} from "./animation.js";
import {ease} from "./ease.js";


var tl = new Timeline();

tl.start();

tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 100, 1000, 0, ease, v => `translateX(${v}px)`));

document.querySelector("#pause-btn").addEventListener("click",()=>tl.pause());
document.querySelector("#resume-btn").addEventListener("click",()=>tl.resume());