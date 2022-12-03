import InitUser from "./InitUser";
import ModalInfo from "./ModalInfo";

export class FishingNet {
  private htmlEl: HTMLElement | null;
  private modal: ModalInfo | undefined;

  constructor(modal: ModalInfo) {
    const template: any = document.querySelector("#fishingNet");
    const clone = template?.content?.cloneNode(true);
    this.htmlEl = clone?.querySelector(".fishing__net");
    this.htmlEl && document.body.appendChild(this.htmlEl);
    this.modal = modal;
    this.initListenners();
  }

  initListenners() {
    this.htmlEl?.querySelector("svg")?.addEventListener("click", () => {
      this.modal?.open(
        {
          uuid: "FishingNet",
          name: "Pesca ilegal o Pesca indiscriminada",
          moreInfo: "https://es.wikipedia.org/wiki/Sobrepesca",
          description: "La pesca indiscriminada acarrea una mezcla diversa de criaturas, incluidos peces perfectamente comestibles que, a pesar de ello, son descartados por pertenecer a una especie equivocada, una especie que no les sirve.\nExisten barcos ilegales que a veces arrojan sus artes de pesca cuando hay barcos de patrulla cerca o cuando se les ha negado la entrada a un puerto.",
          img: "/imgs/sobrepesca.jpg",
          extintion: true,
          extintionPlan: [
            {
              "title": "Tortugas Verdes",
              "resume": ""
            },
          ],
          type: "material",
        },
        {} as InitUser
      );
    });
  }
}
