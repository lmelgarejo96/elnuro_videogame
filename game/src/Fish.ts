import gsap from "gsap";
import { PerspectiveCamera, Scene, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import AnimationController from "./AnimationController";
import DeltaTimer from "./DeltaTimer";
import { XYZ } from "./types";
import { getGltf } from "./utils";

const FISH_FILE_ROOT_PATH = "./glb/fish/";
/* ,"Piranha", "BlueGoldfish" ,  */
export const ANIMAL_NAMES = ["CoralGrouper" ,"Sunfish", "Turtle"] as const;
export type FishName = typeof ANIMAL_NAMES[number] | any;

export default class Fish {
	private deltaTimer = new DeltaTimer();
	animationController: AnimationController | undefined;

  private velocity:XYZ|null = null;
  private paused = false;
  public model : any = null
  public fishName : string = "";


	static async create(fishName: FishName, scene: Scene) {
		const gltf = await getFishGltf(fishName);
    if(fishName === "Turtle") {
      gltf.scene.scale.set(.1,.1,.1)
    }
    if(fishName === 'FishingNet') {
      gltf.scene.scale.set(.1,.1,.1)
    }
		return new Fish(gltf, scene, fishName);
	}

	get group() {
		return this.gltf.scene;
	}

	private constructor(private gltf: GLTF, private scene: Scene, fishName: string) {
    
    if(fishName !== 'FishingNet') { 
      this.animationController = new AnimationController(gltf, this.deltaTimer);
      this.animationController.playAction(0);
      this.deltaTimer.addRequestAnimationFrameHandler(this.move);
    }

		scene.add(gltf.scene);
    this.model = gltf.scene
    this.fishName = fishName
    this.model.userData.isContainer = true
	}

	destroy() {
		this.animationController?.destroy();
    this.deltaTimer.removeRequestAnimationFrameHandler(this.move);
	}


  move = (deltaTime: number) => {
    if(this.velocity){
      const [x, y, z] = this.velocity.map(scale => (deltaTime) * scale);
      this.group.position.x += x;
      this.group.position.y += y;
      this.group.position.z += z;
    }
  }

  setPosition(xyz: XYZ){
    const [x, y, z] = xyz;
    this.group.position.x = x;
    this.group.position.y = y;
    this.group.position.z = z;
  }

  setVelocity(xyz:XYZ){
    this.velocity =  xyz;
    const [x, y, z] = xyz;
    this.group.lookAt(this.group.position.clone().add(new Vector3(x, y ,z)));
  }

  isPaused () {
    return this.paused
  }

  stop () {
    this.paused = true
    /* this.deltaTimer.removeRequestAnimationFrameHandler(this.move);
    this.animationController.destroy();
    this.velocity = [0,0,0] */
  }

  rotateFace (camera: PerspectiveCamera) {
    /* const vector = this.group?.worldToLocal( camera?.getWorldPosition(new Vector3()) );
    const startOrientation = camera.quaternion?.clone();
    const targetOrientation = this.group?.quaternion?.clone()?.normalize();
    console.log(this.group);
    console.log({ startOrientation, targetOrientation, vector });
    gsap.to( {}, {
        duration: 2,
        onUpdate: function() {
          camera.quaternion.copy(startOrientation).slerp(targetOrientation, this.progress());
        }
    } ); */
    const vector = this.group?.worldToLocal( camera?.getWorldPosition(new Vector3()) );
    this.group?.lookAt(vector)
    gsap.to(this.group.position, {
      duration: 1,
      x: vector.x,
      y: vector.y,
      z: vector.z, // maybe adding even more offset depending on your model
      onUpdate: function() {
        this.group?.lookAt(vector)
      }
    } );
    
  }
}

export async function getFishGltf(fishName: FishName) {
	return await getGltf(getFishGlbPath(fishName));
}

function getFishGlbPath(fishName: FishName) {
	return `${FISH_FILE_ROOT_PATH}${fishName}.glb`;
}
