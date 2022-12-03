import { updateUserPoints } from "../services/api";
import InitUser from "./InitUser";

interface Question {
  answers: Array<any>
  correct: number,
  discount: number,
  points: number,
  id: number,
  question: string
}

export default class FormAnimal {

  private htmlEl : HTMLElement | null | any;
  private question : Question | any
  private user : InitUser | null

  constructor(question: object | Question, user: InitUser | null) {
    const template : any = document.querySelector("#formAnimal")
    const clone  = template?.content?.cloneNode(true)
    this.htmlEl = clone?.querySelector(".form__animal")
    
    this.question = question
    this.user = user

    this.initListenners()
    this.htmlEl && document.body.appendChild(this.htmlEl)
    this.renderQuestion()
  }

  renderQuestion() {
    this.htmlEl.querySelector("#question").innerText = this.question?.question
    this.createChecks()
  }

  createChecks () {
    const ul = this.htmlEl?.querySelector(".answers")
    ul.innerHTML = "";
    this.question.answers.forEach((answer: any, index: number) => {
      const li = document.createElement("li")
      const input = document.createElement("input")
      const label = document.createElement("label")

      input.setAttribute("type", "radio")
      input.type = 'radio'
      input.setAttribute("name", "option")
      input.setAttribute("value", `${index+1}`)
      input.setAttribute("id", `opt_${answer.key}`)
      label.setAttribute("for", `opt_${answer.key}`)
      label.innerText = answer.value
      li.appendChild(input)
      li.appendChild(label)
      ul?.appendChild(li)
    })
  }

  initListenners() {
    this.htmlEl?.querySelector("form")?.addEventListener("submit", (ev: any) => {
      ev.preventDefault()
      const selected = this.htmlEl?.querySelector('input[name="option"]:checked')?.value || "";
      if(!selected) return alert("Debes seleccionar una opción.")
      this.processForm(selected)
    })
  }
  
  async processForm(selected: string | number) {
    console.log(selected, this.question, this.user);
    const points = selected == this.question?.correct ? this.question?.points : -this.question?.discount

    const userUpdated = await updateUserPoints(this.user?.getUser() || "", points)
    // const actualPoints = this.user?.getScore().getPoints()
    this.user?.getScore().setPoints(userUpdated?.points)
    this.hide()
    this.destroy()
  }

  hide() {
    this.htmlEl?.classList.add("hide")
  }
  
  destroy() {
    setTimeout(() => {
      this.htmlEl?.remove()
    }, 1200);
  }
}