import ClasificationTable from "./ClasificationTable";


export default class UserScore {
  
  private htmlEl : HTMLElement | null;
  private clasificationTable : ClasificationTable;

  private username = "";
  private points = 0;
  

  constructor() {
    const template : any = document.querySelector("#userScore")
    const clone  = template?.content?.cloneNode(true)
    this.htmlEl = clone?.querySelector("#user-score")
    this.htmlEl && document.body.appendChild(this.htmlEl)
    this.clasificationTable = new ClasificationTable()
    this.initListenners()
  }

  initListenners() {
    this.htmlEl?.addEventListener("click", () => {
      this.clasificationTable.show({
        username: this.username,
        points: this.points,
        img: ""
      })
    })
  }

  setPoints(points: number) {
    if(points < 0) points = 0
    this.points = points
    this.renderPoints()
  }

  getPoints() {
    return this.points
  }

  renderPoints() {
    const pointsField = this.htmlEl?.querySelector("#points")
    pointsField && (pointsField.innerHTML = `${this.getPoints()}`)
  }

  renderUsername(username: string) {
    this.username = username;
    const usernameField = this.htmlEl?.querySelector("#username")
    usernameField && (usernameField.innerHTML = username)
  }

  render(username: string) {
    this.renderPoints()
    this.renderUsername(username)
  }
}