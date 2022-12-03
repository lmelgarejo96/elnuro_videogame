

// import insigniaImg from "../assets/insignia.jpg"

import { getTopUsers } from "../services/api";
import { loadApiImage } from "../utils";

interface IUserRanking {
  username: string,
  points: number,
  img: string
}

const ranking : Array<IUserRanking> = [
  {
    username: "John Doe",
    points: 1500,
    img: "",
  },
  {
    username: "Diana",
    points: 1200,
    img: "",
  },
  {
    username: "Rodrigo",
    points: 800,
    img: "",
  },
  {
    username: "John",
    points: 750,
    img: "",
  },
  {
    username: "Dayana",
    points: 600,
    img: "",
  },
  {
    username: "Sofía",
    points: 500,
    img: "",
  },
  {
    username: "Alex",
    points: 450,
    img: "",
  },
  {
    username: "Juan",
    points: 300,
    img: "",
  },
  {
    username: "Junior",
    points: 100,
    img: "",
  },
  /* {
    username: "Carlos",
    points: 0,
    img: "",
  }, */
];

export default class ClasificationTable {

  public selector: HTMLElement | null;
  public parentHtml : HTMLElement | null;
  public resetBtn : HTMLElement | null;
  private rankingList : Array<IUserRanking> = ranking; 

  constructor() {
    this.selector = document.querySelector(".clasification__list");
    this.parentHtml = document.getElementById("clasification-table")
    this.resetBtn = this.parentHtml?.querySelector("#btn-close-clasification") ?? null;
    
    this.render()
    this.initListenners()
  }

  render(username: string = "") {
    const currentUsername = localStorage.getItem("usr")
    let html = "";
    this.rankingList.map((user, index) => {
      // <span class="clasification__level">Week 1</span>
      html += `
        <div class="clasification__item ${user.username === currentUsername ? 'active' : ''}">
          <div class="clasification__order">
            <span class="p-relative">${index+1}</span>
          </div>
          <div class="clasification__content">
            <img
              height="32"
              src="${loadApiImage(`/imgs/insignia.png`)}"
              class="p-relative"
              alt=""
            />
            <div class="clasification__content_user p-relative">
              <h4>${user.username}</h4>
              
            </div>
          </div>
          <div class="clasification__avatar">
            <img height="26" src="${loadApiImage(`/imgs/avatar.png`)}" alt="" />
          </div>
          <div class="clasification__points">
            <img class="p-relative" height="26" src="${loadApiImage(`/imgs/cup.png`)}" alt="" />
            <span class="p-relative">${user.points}</span>
          </div>
        </div>
      `;
    });
    this.selector && (this.selector.innerHTML = html)
  }

  initListenners () {
    this.resetBtn?.addEventListener("click", () => this.reset())
  }

  reset() {
    this.hide()
  }

  async setRankingUser(user: IUserRanking) {
    const topUsers = await getTopUsers()
    this.rankingList = topUsers
    this.render(user?.username)
  }

  show(user? : IUserRanking) {
    if(user) {
      this.setRankingUser(user)
    }
    this.parentHtml?.classList.add("active")
    
  }
  
  hide () {
    this.parentHtml?.classList.remove("active")
  }
}
