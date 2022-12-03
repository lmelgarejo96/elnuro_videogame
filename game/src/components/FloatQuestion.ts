import FormAnimal from "./FormAnimal";
import InitUser from "./InitUser";


export default class FloatQuestion {
  
  private htmlEl : HTMLElement | null;
  private question : object;
  private user : InitUser | null;

  constructor(question: object, user: InitUser | null) {
    const template : any = document.querySelector("#floatQuestion")
    const clone  = template?.content?.cloneNode(true)
    this.htmlEl = clone?.querySelector(".float__question")
    
    this.question = question
    this.user = user;
    
    this.setRandomPosition()
    this.initRandom()
  }
  
  initRandom () {
    const random = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
    setTimeout(() => {
      this.htmlEl && document.body.appendChild(this.htmlEl)
      this.initListenners()
      setTimeout(() => {
        this.animate()
        this.destroy()
      }, 200);
    }, random);
  }

  setRandomPosition() {
    const width  = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    const random = Math.random() * (width - 40);
    this.htmlEl && (this.htmlEl.style.left = `${random}px`)
  }

  animate () {
    this.htmlEl?.classList.add("dispose")
  }

  initListenners() {
    this.htmlEl?.querySelector("button")?.addEventListener("click", () => this.callForm())
  }

  callForm () {
    new FormAnimal(this.question, this.user)
  }

  destroy() {
    setTimeout(() => {
      this.htmlEl?.remove()
    }, 25000);
  }
}