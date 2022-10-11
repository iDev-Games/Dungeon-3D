import { _decorator, Component, RigidBody, Quat, Vec3, Animation, Node, PhysicsSystem, BoxCollider } from 'cc';
import { globalVars } from '../globalVars';
const { ccclass, property } = _decorator;

@ccclass('Spider')
export class Spider extends Component {

    /* Local Variables */

    private animState = "idle";
    private idle = 0;
    private intialRotation;
    private waypoint = 1;
    private hunting = 1;
    private resting = 1;
    private restingTime = 1;
    private distance = 12;
    private jumpStrength = 200;
    private maxSpeed = 0.05;
    private speed = 4;
    private grounded = false;
    private decay = 0;
    private animation;

    @property(Number)
    health: Number = null;

    /* End Local Variables */


    start() {
        this.animation = this.node.getChildByName("Spider");
        this.intialRotation = this.node.getRotation();
        this.animation.getComponent(Animation).play("Armature|run");
        this.node.getComponent(BoxCollider).on('onCollisionStay', this.OnCollisionStay, this);
        this.node.getComponent(BoxCollider).on('onCollisionExit', this.OnCollisionExit, this);
        this.animState = "run";
    }

    OnCollisionStay(event: ICollisionEvent) {
        event.contacts.forEach(contact => {
            let out: Vec3 = new Vec3();
            contact.getWorldNormalOnB(out);
            if(contact.event.otherCollider.node._name != "Player"){
                if (Vec3.angle(out, Vec3.UP) < 60) {
                    this.grounded = true;
                }
            } else {
                if(this.health >= 1){
                    globalVars.character.causeDamage(this);
                }
            }
        });
    }

    OnCollisionExit() {
        this.grounded = false;
    }

    update(){
        var distance = Vec3.distance(globalVars.camera.node.getPosition(), this.node.getWorldPosition());
        if(this.health >= 1 && globalVars.currentHealth > 0){
                //if(distance < this.distance){
                    var doJump = Math.floor(Math.random() * (5 - 1 + 1) + 1);
                    if(doJump == 2){
                        if(this.grounded == true){
                            this.node.getComponent(RigidBody).applyLocalForce(new Vec3(0,this.jumpStrength*this.node.getComponent(RigidBody).mass,0), new Vec3(0,10,0));
                            this.animState = "jump";
                            this.idle = 0;
                        }
                    } else {
                        if(this.grounded == true && (this.animState == "jump" || this.animState == "idle")){
                            this.animState = "run";
                            this.idle = 0;
                            this.node.getComponent(RigidBody).setLinearVelocity(new Vec3(this.node.forward.x*this.speed,this.node.forward.y*this.speed,this.node.forward.z*this.speed));
                        }
                    }
                    this.node.lookAt(new Vec3(globalVars.camera.node.getPosition().x, 0, globalVars.camera.node.getPosition().z));
               /* } else {
                    this.animState = "idle";
                }*/

            if(this.animState == "idle" && this.idle == 1){
                if(this.hunting == 1){
                    this.animation.getComponent(Animation).crossFade("Armature|idle", 0.5);
                    this.idle = 0;
                }
            } else if(this.animState == "run" && this.idle == 0){
                if(this.hunting == 1){
                    this.animation.getComponent(Animation).crossFade("Armature|run", 0.5);
                    this.idle = 1;
                }
            } else if(this.animState == "jump" && this.idle == 0){
                if(this.hunting == 1){
                    this.animation.getComponent(Animation).crossFade("Armature|jump", 0.5);
                    this.idle = 1;
                }
            }
        }

        if(globalVars.currentHealth <= 0){
            this.animation.getComponent(Animation).crossFade("Armature|idle", 0.5);
            this.idle = 0;
        }

        if(this.health < 1){
            if(this.animState != "dead"){
                this.node.getComponent(RigidBody).clearState();
                if(this.animState == "jump"){
                    this.animation.getComponent(Animation).crossFade("Armature|die", 0.5);
                } else {
                    this.animation.getComponent(Animation).crossFade("Armature|die", 0.5);
                }
                this.animState = "dead";
                this.node.getComponent(RigidBody).enabledContactListener = false;
                setTimeout( () => {
                    this.decay = 1;
                    this.node.removeComponent(RigidBody);
                    this.node.removeComponent(BoxCollider);
                    setTimeout( () => {
                        this.node.destroy();
                    }, 5000 );
                }, 10000 );
            }
            if(this.decay == 1){
                this.node.setPosition(new Vec3(this.node.getPosition().x,this.node.getPosition().y - 0.01,this.node.getPosition().z)); 
            }
        }  
    }
}

