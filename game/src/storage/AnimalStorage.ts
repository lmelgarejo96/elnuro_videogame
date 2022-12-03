import { getAnimals } from "../services/api"


export default class AnimalsStorage {
  private animals : Array<any> = []

  constructor() {
    this.loadInitialData()
  }
  
  async loadInitialData () {
    this.animals = await getAnimals()
  }

  public getAnimals () {
    return this.animals
  }

  public findAnimalById (animalId: string) {
    return this.animals.find((animal) => animal.uuid === animalId)
  }
}
