import { AmbientLight, DirectionalLight, Raycaster, Group, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer } from "three"
import { FishingNet } from "./components/FishingNet";
import InitUser from "./components/InitUser";
import ModalInfo from "./components/ModalInfo";
import Fish, { FishName, ANIMAL_NAMES } from "./Fish";
import AnimalStorage from "./storage/AnimalStorage";
import { XYZ } from "./types";
import { addOrbitControls, findGLTFObjectByObjectId, getContainerObjByChild, getRandomNumber, mapXYZ, resizeFullScreen, startAnimation } from "./utils";

const animalStorage = new AnimalStorage()
const raycaster = new Raycaster();
const modal = new ModalInfo()
const mouse = new Vector2()
// let user: InitUser;

function initCameraPosition(camera: PerspectiveCamera){
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 50;
  camera.lookAt(0, 0, 0);
}

function addRights(scene: Scene){
  const ambientLight = new AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(-1, 10, 0)
  scene.add(directionalLight)
}

function translateGroup(group: Group, xyz: [number, number, number]){
  const [x, y, z] = xyz;
  group.translateX(x);
  group.translateY(y);
  group.translateZ(z);
}

function onMouseDown(e:any, camera: PerspectiveCamera, scene : Scene, animals: Array<Fish>, user: InitUser) {

  e.preventDefault();

  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  let intersects = raycaster.intersectObjects(scene.children, true );

  if ( intersects.length > 0 ) {
    const object = getContainerObjByChild(intersects[0].object) ;
    const animal : Fish = findGLTFObjectByObjectId(animals, object?.uuid)
    animal.stop()
    console.log("abriendo user",user);
    modal.open(animalStorage.findAnimalById(animal.fishName), user)
  }
  
}

function watchIntersections (camera: PerspectiveCamera, scene : Scene, animals: Array<Fish>, user: InitUser) {
  document.getElementById("mainCanvas")?.addEventListener('mousedown', (e: any) => {
    console.log("user", user);
    onMouseDown(e, camera, scene, animals, user)
  }, false);
}

export async function initGame(userInit: InitUser){
  const mainCanvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
  const {
    innerHeight: height,
    innerWidth: width
  } = window;

  const scene = new Scene();
  const renderer = new WebGLRenderer({
    canvas: mainCanvas,
    alpha: true
  }) 
  

  const camera = new PerspectiveCamera(45, width/height, 0.1, 5000);
  renderer.setSize(width, height);

  initCameraPosition(camera)
  addOrbitControls(camera, mainCanvas);
  startAnimation(renderer, camera, scene);
  addRights(scene);
  resizeFullScreen(renderer, camera);
  renderer.setClearColor( 0x000000, 0 );

  //user = userInit;

  console.log("usuario inicio", userInit);
  new FishingNet(modal)

  const animals = await createRandomAnimal(15, scene)
  watchIntersections(camera, scene, animals, userInit)
}

async function createRandomAnimal(count: number, scene:Scene) : Promise<Array<Fish>>{
  const promises : Array<Promise<any>> = []
  for (let i = 0; i < count; i ++) {
    const animalName = ANIMAL_NAMES[Math.floor(Math.random() * ANIMAL_NAMES.length)];
    promises.push(createAnimal(animalName, scene));
  }
  const animals : Array<Fish> = await Promise.all(promises)
  return animals
}

function createAnimal(fishName:FishName, scene:Scene){
  return new Promise((resolve, reject) => {
    Fish.create(fishName, scene).then((fish) => {
      fish.setPosition([getRandomNumber(-40, 40), getRandomNumber(-20, 20), getRandomNumber(-80, 0)]);
      startMovingFish(fish)
      resolve(fish)
    });
  })
}

function startMovingFish(fish: Fish){
  if(fish.fishName === 'FishingNet') return
  updateFishVelocity(fish);

  // Fish change direction and velocity
  setInterval(() => {
    if(Math.random() > 0.96 && !fish.isPaused()){
      updateFishVelocity(fish);
    }
  }, 500)
}

function updateFishVelocity(fish:Fish){
  const {x,y,z} = fish.group.position;
  const destPosition:XYZ = [getRandomNumber(-20, 20), getRandomNumber(-20, 20), getRandomNumber(-80, 0)]
  const velocity = getVelocity(destPosition, [x, y, z]);
  fish.setVelocity([ velocity.x,velocity.y,velocity.z ]);
}

function getVelocity(destPosition:XYZ, initPosition:XYZ){
  const [x,y,z] = mapXYZ(destPosition, initPosition, (a, b) => a - b);
  return (new Vector3(x, y, z)).normalize().multiplyScalar((Math.random() * 5) + 1);
}
