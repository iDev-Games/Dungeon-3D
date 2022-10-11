import { _decorator, Component, RigidBody, Quat, Vec3, Animation, Node, PhysicsSystem, BoxCollider, SphereCollider, CylinderCollider } from 'cc';
import { globalVars } from '../globalVars';
const { ccclass, property } = _decorator;

@ccclass('Eyeball')
export class Eyeball extends Component {

    /* Local Variables */

    private animState = "idle";
    private idle = 0;
    private intialRotation;
    private waypoint = 1;
    private hunting = 1;
    private resting = 0;
    private restingTime = 1;
    private maxSpeed = 0.05;
    private speed = 1;
    private decay = 0;

    @property(Number)
    health: Number = 3;

    /* End Local Variables */


    start() {
        this.intialRotation = this.node.getRotation();
        this.node.getChildByName("eyeballModel").getComponent(Animation).play("Armature|run");
        this.animState = "run";
    }

    update(){
        var distance = Vec3.distance(globalVars.camera.node.getPosition(), this.node.getWorldPosition());
        var animation = this.node.getChildByName("eyeballModel");
        if(this.health >= 1){
            if(distance < 12){
                this.resting = 0;
                this.node.lookAt(new Vec3(globalVars.camera.node.getPosition().x, globalVars.camera.node.getPosition().y, globalVars.camera.node.getPosition().z));
                this.animState = "run";
                this.hunting = 1;
            } else {
                this.animState = "idle";
                this.hunting = 0;
            }

            if(this.animState == "idle" && this.idle == 1){
                if(this.hunting == 1){
                    animation.getComponent(Animation).play("Armature|Idle");
                    this.idle = 0;
                }
            } else if(this.animState == "run" && this.idle == 0){
                if(this.hunting == 1){
                    animation.getComponent(Animation).play("Armature|run");
                    this.idle = 1;
                }
            }

            if(this.hunting == 0){
                var currentWaypoint = this.node.parent.getChildByName("waypoints").getChildByName("waypoint"+this.waypoint);
                var waypointDistance = Vec3.distance(currentWaypoint.getWorldPosition(), this.node.getWorldPosition());

                if(waypointDistance > 1){
                    this.node.lookAt(new Vec3(currentWaypoint.getWorldPosition().x, currentWaypoint.getWorldPosition().y, currentWaypoint.getWorldPosition().z));
                } else {
                    var waypointCount = this.node.parent.getChildByName("waypoints").children.length;
                    var randomWaypoint = this.waypoint;
                    while(randomWaypoint == this.waypoint){
                        randomWaypoint = Math.floor(Math.random() * (waypointCount - 1 + 1) + 1);
                    }
                    this.waypoint = randomWaypoint;
                    currentWaypoint = this.node.parent.getChildByName("waypoints").getChildByName("waypoint"+this.waypoint);
                    this.node.getComponent(RigidBody).clearForces();
                    this.node.lookAt(new Vec3(currentWaypoint.getWorldPosition().x, currentWaypoint.getWorldPosition().y, currentWaypoint.getWorldPosition().z));
                    this.restingTime = Math.floor(Math.random() * (3 - 1 + 1) + 1);
                    this.resting = 1;
                    this.idle = 0;
                }
            }
            if(this.resting == 0){
                this.node.getComponent(RigidBody).applyLocalImpulse(new Vec3(0,0,-(this.maxSpeed*this.node.getComponent(RigidBody).mass)*(this.speed*(this.hunting+1))));
            }
            if(this.resting == 0 && this.idle == 1){
                    this.idle = 0;
                    animation.getComponent(Animation).play("Armature|run");
                    this.animState == "run";
            } else if(this.idle == 0 && this.resting == 1) {
                animation.getComponent(Animation).play("Armature|Idle");
                this.animState == "idle";
                this.resting = 2;
                this.node.getComponent(RigidBody).setLinearVelocity(new Vec3(this.node.forward.x*this.speed,this.node.forward.y*this.speed,this.node.forward.z*this.speed));
                setTimeout( () => {
                    this.idle = 1;
                    this.resting = 0;
                }, this.restingTime*1000 );
            }
        }

        if(this.health < 1){
            if(this.animState != "dead"){
                this.node.getComponent(RigidBody).clearState();
                animation.getComponent(Animation).play("Armature|die");
                this.animState = "dead";
                this.node.getComponent(RigidBody).enabledContactListener = false;
                this.node.getChildByName("shadow").destroy();
                setTimeout( () => {
                    this.decay = 1;
                    setTimeout( () => {
                        this.node.parent.destroy();
                    }, 5000 );
                }, 10000 );
            }
            this.node.removeComponent(RigidBody);
            this.node.removeComponent(BoxCollider);
            this.node.removeComponent(SphereCollider);
            this.node.removeComponent(CylinderCollider);
            if(this.decay == 1){
                this.node.setPosition(new Vec3(this.node.getPosition().x,this.node.getPosition().y - 0.01,this.node.getPosition().z)); 
            }
        }  
    }
}

