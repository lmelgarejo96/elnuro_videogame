import InitUser from "./components/InitUser";
import { initGame } from "./game";

const user = new InitUser()

function main () {
  initGame(user)
  if(user.hasUser()) {
    user.hide()
  }
}

main()