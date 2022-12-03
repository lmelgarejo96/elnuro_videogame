import { loadApiImage } from "../utils";
import FloatQuestion from "./FloatQuestion";
import InitUser from "./InitUser";

export default class ModalInfo {

  public htmlEL : any | HTMLElement = null;
  public overlay : HTMLElement | null;
  public user : InitUser | null = null;
  public animalInfo: object | null | any = null;

  constructor() {
    const template : any = document.querySelector("#modalTemplate")
    const clone  = template?.content?.cloneNode(true)
    this.htmlEL = clone?.querySelector("#modal")
    this.overlay = document.querySelector(".overlay") ?? null;
    this.initListenners()
    document.body.appendChild(this.htmlEL)
  }
  
  initListenners () {
    this.htmlEL?.querySelector(".close__btn")?.addEventListener("click", () => this.close())
    this.overlay?.addEventListener("click", () => this.close())
  }

  open(animalInfo: object, user: InitUser) {
    if(!animalInfo) return
    
    this.animalInfo = animalInfo
    user && (this.user = user)

    this.htmlEL?.classList?.add("active")
    this.htmlEL?.classList.add(this.animalInfo?.type)
    this.overlay?.classList.add("active")

    console.log("user en modal info", user);
    this.replaceData(animalInfo)
  }

  close() {
    this.htmlEL?.classList?.remove("active")
    this.htmlEL?.classList.remove(this.animalInfo?.type)
    this.overlay?.classList.remove("active")
    if(this.animalInfo?.type == 'material') return
    this.animalInfo?.questions?.forEach((question: any) => {
      new FloatQuestion(question, this.user)
    });
  }

  replaceData (animalInfo: any) {
    if(animalInfo) {

      this.htmlEL.querySelector(".extintion__container").innerHTML = ""
      this.htmlEL.querySelector(".extintion__plan").innerHTML = ""

      this.htmlEL?.querySelector(".img__animal").setAttribute("src", loadApiImage(animalInfo.img))
      this.htmlEL.querySelector("#animal_title").innerHTML = animalInfo.name
      this.htmlEL.querySelector("#animal_description").innerHTML = animalInfo.description
      this.htmlEL.querySelector("#animal_biology").innerHTML = animalInfo.biology
      this.htmlEL.querySelector("#animal_more_info").innerHTML = animalInfo.moreInfo
      this.htmlEL.querySelector("#animal_more_info").setAttribute("href", animalInfo.moreInfo)
      this.htmlEL.querySelector("#specie").innerHTML = animalInfo.specie
      this.htmlEL.querySelector("#height").innerHTML = animalInfo.length || '--'
      this.htmlEL.querySelector("#weight").innerHTML = animalInfo.weight || '--'
      if(this.animalInfo?.extintion) {
        const isAnimal = this.animalInfo?.type == 'animal'
        const title = isAnimal ? 'Animal en Peligro de extinción' : 'Actividad Prohibida' 
        const subtitle = isAnimal ? `${this.animalInfo?.extintionQuantity} especies encontradas` : 'Esta actividad pone en peligro la fauna marítima de la playa "El ñuro"' 
        const titlePlan = isAnimal ? '¿Cómo ayudar a preservar esta especie?' : 'Especies Afectadas:'

        this.htmlEL.querySelector(".extintion__container").innerHTML = `
        <div class="extintion__detail">
          <i class="fa-solid fa-triangle-exclamation icon"></i>
          <p>
            <span class="extintion__title">${title}</span>
            <br>
            <span class="extintion__subtitle">${subtitle}</span>
          </p>
        </div>
        `
        this.htmlEL.querySelector(".extintion__plan").innerHTML = `
        <h3 class="modal__subtitle">${titlePlan}</h3>
        <ul>${this.animalInfo?.extintionPlan?.map((item: any) => `<li><strong class="text__red">${item?.title}. </strong><span>${item?.resume}</span></li>`)}</ul>
        `
      }
    }
  }
}