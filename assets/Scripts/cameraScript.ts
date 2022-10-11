import { _decorator, Component, Input, Vec3, RigidBody, AudioSource, Camera, input, director, quat, game, Node, Sprite, Color, BoxCollider } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('cameraScript')
export class cameraScript extends Component {

    /* Local Variables */

        private mouseXSensitvity: number = 8;
        private mouseYSensitvity: number = 5;
        private mousePos = new Vec3(0, 0, 0);

    /* End Local Variables */

    start() {
        this.scene = director.getScene();
        globalVars.start = 0;
        globalVars.camera = this;
        document.addEventListener('pointerlockchange', this.lockChange, false);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        this.getComponent(AudioSource).play("background.wav");
    }

    update(deltaTime: number) {
        if(globalVars.currentHealth > 0){
            //this.node.getComponent(RigidBody).sleep();
            //this.node.getComponent(BoxCollider).off();
            this.node.removeComponent(RigidBody);
            this.node.removeComponent(BoxCollider);
        } else if(globalVars.currentHealth <= 0){
            globalVars.character.die(this);
            this.node.addComponent(RigidBody);
            this.node.addComponent(BoxCollider);
            //this.node.getComponent(RigidBody).wakeUp();
            //this.node.getComponent(BoxCollider).on();
        }

        if(globalVars.currentHealth > 0){
            this.node.setPosition(globalVars.character.node.getPosition());
        }

        globalVars.arms.node.setPosition(this.node.getPosition().x,this.node.getPosition().y,this.node.getPosition().z);
        globalVars.arms2.node.setPosition(this.node.getPosition().x,this.node.getPosition().y,this.node.getPosition().z);
        globalVars.arms3.node.setPosition(this.node.getPosition().x,this.node.getPosition().y,this.node.getPosition().z);
        globalVars.arms4.node.setPosition(this.node.getPosition().x,this.node.getPosition().y,this.node.getPosition().z);
        this.scene.getChildByName("Breath").setPosition(this.node.getPosition().x,this.node.getPosition().y-0.1,this.node.getPosition().z);
        if(globalVars.start == 1){
            if(this.mousePos.x >= 270 && this.mousePos.x <= 450){
                globalVars.arms.node.setRotationFromEuler(0,this.mousePos.y+90,this.mousePos.x);
                globalVars.arms2.node.setRotationFromEuler(0,this.mousePos.y+90,this.mousePos.x);
                globalVars.arms3.node.setRotationFromEuler(0,this.mousePos.y+90,this.mousePos.x);
                globalVars.arms4.node.setRotationFromEuler(0,this.mousePos.y+90,this.mousePos.x);
                if(globalVars.currentHealth > 0){
                    this.node.setRotationFromEuler(this.mousePos);
                }
            } else if(this.mousePos.x < 270){
                globalVars.arms.node.setRotationFromEuler(0, this.mousePos.y+90,270);
                globalVars.arms2.node.setRotationFromEuler(0, this.mousePos.y+90,270);
                globalVars.arms3.node.setRotationFromEuler(0, this.mousePos.y+90,270);
                globalVars.arms4.node.setRotationFromEuler(0, this.mousePos.y+90,270);
                if(globalVars.currentHealth > 0){
                    this.node.setRotationFromEuler(270, this.mousePos.y,0);
                }
            } else if(this.mousePos.x > 450){
                globalVars.arms.node.setRotationFromEuler(0, this.mousePos.y+90,450);
                globalVars.arms2.node.setRotationFromEuler(0, this.mousePos.y+90,450);
                globalVars.arms3.node.setRotationFromEuler(0, this.mousePos.y+90,450);
                globalVars.arms4.node.setRotationFromEuler(0, this.mousePos.y+90,450);
                if(globalVars.currentHealth > 0){
                    this.node.setRotationFromEuler(450, this.mousePos.y,0);
                }
            }
            if(globalVars.currentHealth > 0){
                globalVars.character.node.setRotationFromEuler(new Vec3(0, this.mousePos.y, 0));
            }
            //let scene = director.getScene();
            //scene.getChildByName("Shadow Light").setPosition(this.node.getPosition().x,scene.getChildByName("Shadow Light").getPosition().y,scene.getChildByName("Shadow Light").getPosition().z)
            //scene.getChildByName("Shadow Light").setRotation(this.node.getRotation());
            //globalVars.shadowLight.node.setRotation(this.node.getRotation());
            this.scene.getChildByName("Breath").setRotation(this.node.getRotation());
        }
    }

    onMouseUp(event:EventMouse){
        if(globalVars.start == 0){
            if (game.canvas.requestPointerLock) {
                game.canvas.requestPointerLock();
            }
        }
    }

    lockChange() {
        if (document.pointerLockElement === game.canvas ) {
          globalVars.start = 1;
        } else {
          globalVars.start = 3;
          setTimeout( () => { globalVars.start = 0; }, 1800 );
        }
    }

    onMouseMove(event:EventMouse){
        this.mousePos.x = 330 + event.getLocation().y/this.mouseXSensitvity;
        this.mousePos.y = -event.getLocation().x/this.mouseYSensitvity;
        globalVars.mouseX = this.mousePos.x;
        globalVars.mouseY = this.mousePos.y;
    }
    cameraCenter(){
        globalVars.start = 1;
        this.node.removeComponent(RigidBody);
        this.node.removeComponent(BoxCollider);
        this.node.setRotationFromEuler(0,90,0);
    }
}