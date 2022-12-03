import { findOrCreateUser } from "../services/api";
import UserScore from "./UserScore";


export default class InitUser {

  private htmlEl : HTMLElement | null;
  private score : UserScore;

  constructor() {
    const template : any = document.querySelector("#initTemplate")
    const clone  = template?.content?.cloneNode(true)
    this.htmlEl = clone?.querySelector("#init-user")
    this.htmlEl && document.body.appendChild(this.htmlEl)

    this.score = new UserScore()
    this.initListenners()

    this.hasUser() && (this.score.render(this.getUser() || ""))
    this.hasUser() && this.updateUser()
  }

  private async updateUser () {
    const user = await findOrCreateUser(this.getUser() || "")
    if(!user) return
    this.score.setPoints(user.points)
  }

  private initListenners () {
    this.htmlEl?.querySelector("form")?.addEventListener("submit", async (ev) => {
      ev.preventDefault()
      const username = this.htmlEl?.querySelector("input")?.value
      if(!username) return alert("Debes ingresar un usuario.")
      const userFounded = await findOrCreateUser(username)
      if(!userFounded) {
        alert("Error buscando usuario")
        return
      }
      this.setUser(username)
      this.score.setPoints(userFounded.points)
      this.hide()
    })
  }

  getScore() {
    return this.score
  }

  hasUser() {
    return !!localStorage.getItem("usr")
  }

  setUser(user: string) {
    localStorage.setItem("usr", user)
    this.score.render(user)
  }

  getUser() {
    return localStorage.getItem("usr")
  }

  show () {
    this.htmlEl?.classList.remove("inactive")
  }

  hide () {
    this.htmlEl?.classList.add("inactive")
  }
}