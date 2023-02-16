import { _decorator, director, Component, Node, game, input, AudioSource, Input, KeyCode, EventKeyboard, Vec3, CapsuleCollider, ICollisionEvent, Color, Sprite, RigidBody, EventMouse, PhysicsSystem, Label } from 'cc';
import { globalVars } from './globalVars';
import { ammoScript } from './ammoScript';
const { ccclass, property } = _decorator;

@ccclass('PlayerScript')
export class PlayerScript extends Component {

    /* Local Variables */

        private movementSpeed = 3;
        private jumpStrength = 400;
        private crouch = 0;
        private moveForward = 0;
        private moveBackward = 0;
        private moveLeft = 0;
        private moveRight = 0;
        private setSpeed = 8;
        private maxSpeed = 0;
        private speed = 1;
        private grounded = false;
        private collider: CapsuleCollider = null!;
        private playerHeight = 2;
        private jump = 0;
        private scene;
        private died = false;
        private milliseconds = 0;
        private minutes = 0;
        private seconds = 0;
        private end = false;
        private nodePos: Vec3 = new Vec3();

    /* End Local Variables */
    
    start() {
        this.scene = director.getScene();
        globalVars.character = this;
        globalVars.HealthBar = this.scene.getChildByName("UI").getChildByName("HealthBar");
        globalVars.HealthLabel = this.scene.getChildByName("UI").getChildByName("HealthLabel");
        globalVars.LivesLabel = this.scene.getChildByName("UI").getChildByName("LivesLabel");
        globalVars.AmmoLabel = this.scene.getChildByName("UI").getChildByName("AmmoLabel");
        globalVars.currentgun = 1;
        globalVars.lives = 3;
        globalVars.maxHealth = 100;
        globalVars.currentHealth = 100;
        globalVars.checkpoint = 0;
        globalVars.reload = false;
        globalVars.timer = this.minutes.toFixed(2)+":"+this.seconds.toFixed(2);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
        this.node.getComponent(CapsuleCollider).on('onCollisionStay', this.OnCollisionStay, this);
        this.node.getComponent(CapsuleCollider).on('onCollisionExit', this.OnCollisionExit, this);
        this.node.getComponent(CapsuleCollider).radius = this.playerHeight;
        this.maxSpeed = this.setSpeed;
        //this.scene.getChildByName("hitThunder").play("hitThunder.wav");
        //this.node.setRotation(0,0,0);
    }

    OnCollisionStay(event: ICollisionEvent) {
        event.contacts.forEach(contact => {
            let out: Vec3 = new Vec3();
            contact.getWorldNormalOnB(out);
            if (Vec3.angle(out, Vec3.UP) < 60) {
                this.grounded = true;
            }
        });
    }

    OnCollisionExit() {
        this.grounded = false;
    }

    onKeyDown(event: EventKeyboard){
        switch(event.keyCode) {
            case KeyCode.KEY_A: {
                this.moveLeft = 1;
            break;}

            case KeyCode.KEY_W: {
                this.moveForward = 1;
            break;}

            case KeyCode.KEY_D: {
                this.moveRight = 1;
            break;}

            case KeyCode.KEY_S: {
                this.moveBackward = 1;
            break;}

            case KeyCode.SHIFT_LEFT: {
                this.setSpeed = 10;
            break;}

            case KeyCode.KEY_C: {
                if(this.crouch == 0 && globalVars.currentHealth > 0){
                    this.crouch = 1;
                    this.node.getComponent(RigidBody).clearForces();
                    this.node.getComponent(CapsuleCollider).cylinderHeight = this.playerHeight/10;
                    this.maxSpeed = this.setSpeed/1.4;
                } else if(this.crouch == 1 && globalVars.currentHealth > 0){
                    this.crouch = 0;
                    this.node.getComponent(CapsuleCollider).cylinderHeight = this.playerHeight;
                    this.maxSpeed = this.setSpeed;
                }
            break;}

            case KeyCode.SPACE: {
                if(this.jump < 2){
                    if(this.grounded && this.crouch == 0 && globalVars.currentHealth > 0){
                        this.jump++;
                        this.node.getComponent(RigidBody).applyLocalForce(new Vec3(0,this.jumpStrength*this.node.getComponent(RigidBody).mass,0), new Vec3(0,10,0));
                        setTimeout( () => { this.jump = 0 }, 2000 );
                    }
                }
            break;}
        }
    }

    onKeyUp(event: EventKeyboard){
        switch(event.keyCode) {
            case KeyCode.KEY_A: {
                this.moveLeft = 0;
            break;}

            case KeyCode.KEY_W: {
                this.moveForward = 0;
            break;}

            case KeyCode.KEY_D: {
                this.moveRight = 0;
            break;}

            case KeyCode.KEY_S: {
                this.moveBackward = 0;
            break;}

            case KeyCode.SHIFT_LEFT: {
                this.setSpeed = 8;
            break;}

            case KeyCode.KEY_R: {
                if(globalVars.currentgun == 1){
                    globalVars.arms.reload();
                } else if(globalVars.currentgun == 2){
                    globalVars.arms2.reload();
                } else if(globalVars.currentgun == 3) {
                    globalVars.arms3.reload();
                } else if(globalVars.currentgun == 4) {
                    globalVars.arms4.reload();
                }
            break;}

            case KeyCode.DIGIT_1: {
                if(globalVars.reload == false){
                    var oldCurrentGun = globalVars.currentgun;
                    globalVars.currentgun = 1;
                    if(oldCurrentGun == 2){
                        globalVars.arms2.changeWeapon();
                    } else if(oldCurrentGun == 3) {
                        globalVars.arms3.changeWeapon();
                    } else if(oldCurrentGun == 4) {
                        globalVars.arms4.changeWeapon();
                    }
                }
            break;}

            case KeyCode.DIGIT_2: {
                if(globalVars.reload == false){
                    var oldCurrentGun = globalVars.currentgun;
                    globalVars.currentgun = 2;
                    if(oldCurrentGun== 1){
                        globalVars.arms.changeWeapon();
                    } else if(oldCurrentGun== 3) {
                        globalVars.arms3.changeWeapon();
                    } else if(oldCurrentGun== 4) {
                        globalVars.arms4.changeWeapon();
                    }
                }
            break;}

            case KeyCode.DIGIT_3: {
                if(globalVars.reload == false){
                    var oldCurrentGun = globalVars.currentgun;
                    globalVars.currentgun = 3;
                    if(oldCurrentGun== 1){
                        globalVars.arms.changeWeapon();
                    } else if(oldCurrentGun== 2) {
                        globalVars.arms2.changeWeapon();
                    } else if(oldCurrentGun== 4) {
                        globalVars.arms4.changeWeapon();
                    }
                }
            break;}

            case KeyCode.DIGIT_4: {
                /*if(globalVars.reload == false){
                    var oldCurrentGun = globalVars.currentgun;
                    globalVars.currentgun = 4;
                    if(oldCurrentGun== 1){
                        globalVars.arms.changeWeapon();
                    } else if(oldCurrentGun== 2) {
                        globalVars.arms2.changeWeapon();
                    } else if(oldCurrentGun== 3) {
                        globalVars.arms3.changeWeapon();
                    }
                }*/
            break;}
        }
    }

    update(deltaTime: number) {
        if(globalVars.currentHealth > 0){
            this.nodePos = this.node.getPosition();
            if(this.moveForward){
                Vec3.add(this.nodePos, this.nodePos, this.node.forward.clone().multiplyScalar(this.setSpeed * deltaTime));
                this.node.setPosition(this.nodePos);
            }
            if(this.moveBackward){
                Vec3.add(this.nodePos, this.nodePos, this.node.forward.clone().multiplyScalar(-this.setSpeed * deltaTime));
                this.node.setPosition(this.nodePos);
            }
            if(this.moveLeft){
                Vec3.add(this.nodePos, this.nodePos, this.node.right.clone().multiplyScalar((-this.setSpeed)/2 * deltaTime));
                this.node.setPosition(this.nodePos);
            }
            if(this.moveRight){
                Vec3.add(this.nodePos, this.nodePos, this.node.right.clone().multiplyScalar((this.setSpeed)/2 * deltaTime));
                this.node.setPosition(this.nodePos);
            }

            if(this.moveForward == 1 || this.moveLeft == 1 || this.moveRight == 1  || this.moveBackward == 1 || this.grounded == false){
                if(globalVars.moving == 0 && this.grounded && globalVars.currentHealth > 0){
                    this.getComponent(AudioSource).play("walk.wav");
                }
                globalVars.moving = 1;
            } else {
                this.getComponent(AudioSource).stop();
                globalVars.moving = 0;
            }
        }

            if(globalVars.currentHealth <= 0){
                this.node.getComponent(RigidBody).sleep();
                this.node.getComponent(CapsuleCollider).off();
            }

        if(globalVars.currentgun == 1){
            if(ammoScript.clipsGun1 == -1){
                globalVars.AmmoLabel.getComponent(Label).string = parseInt(ammoScript.bulletsGun1)+" |	∞";
            } else {
                globalVars.AmmoLabel.getComponent(Label).string = parseInt(ammoScript.bulletsGun1-(ammoScript.clipsGun1*Math.floor(ammoScript.totalClipsGun1)))+" | "+Math.ceil(ammoScript.totalClipsGun1);
            }
        } else if(globalVars.currentgun == 2){
            if(ammoScript.clipsGun2 == -1){
                globalVars.AmmoLabel.getComponent(Label).string = parseInt(ammoScript.bulletsGun2)+" |	∞";
            } else {
                globalVars.AmmoLabel.getComponent(Label).string = parseInt(ammoScript.bulletsGun2-(ammoScript.clipsGun2*Math.floor(ammoScript.totalClipsGun2)))+" | "+Math.ceil(ammoScript.totalClipsGun2);
            }
        } else if(globalVars.currentgun == 3){
            if(ammoScript.clipsGun3 == -1){
                globalVars.AmmoLabel.getComponent(Label).string = parseInt(ammoScript.bulletsGun3)+" |	∞";
            } else {
                globalVars.AmmoLabel.getComponent(Label).string = parseInt(ammoScript.bulletsGun3-(ammoScript.clipsGun3*Math.floor(ammoScript.totalClipsGun3)))+" | "+Math.ceil(ammoScript.totalClipsGun3);
            }
        } else if(globalVars.currentgun == 4){
            if(ammoScript.clipsGun4 == -1){
                globalVars.AmmoLabel.getComponent(Label).string = parseInt(ammoScript.bulletsGun4)+" |	∞";
            } else {
                globalVars.AmmoLabel.getComponent(Label).string = parseInt(ammoScript.bulletsGun4-(ammoScript.clipsGun4*Math.floor(ammoScript.totalClipsGun4)))+" | "+Math.ceil(ammoScript.totalClipsGun4);
            }
        }
        this.scene.getChildByName("FloorMist").setPosition(globalVars.character.node.getPosition().x,globalVars.character.node.getPosition().y-10,globalVars.character.node.getPosition().z);
        this.scene.getChildByName("Mist").setPosition(globalVars.character.node.getPosition().x,globalVars.character.node.getPosition().y-10,globalVars.character.node.getPosition().z);
        if(globalVars.currentHealth > 0){
            if(this.milliseconds < 59){
                this.milliseconds++;
            } else {
                this.milliseconds = 0;
                if(this.seconds < 59){
                    this.seconds++;
                } else {
                    this.minutes++;
                    this.seconds = 0;
                }
                
            }
        }
        globalVars.timer = this.minutes+":"+this.seconds+":"+this.milliseconds;
        this.scene.getChildByName("UI").getChildByName("Timer").getComponent(Label).string = globalVars.timer;
    }
    die(){
        if(globalVars.currentHealth <= 0){
            globalVars.arms.node.active = false;
            globalVars.arms2.node.active = false;
            globalVars.arms3.node.active = false;
            globalVars.arms4.node.active = false;
            globalVars.currentgun = 0;
            globalVars.damageFlash.node.getComponent(Sprite).color = new Color(255,255,255,255);
            this.died = true;
            setTimeout( () => { 
                if(globalVars.lives > 0 && this.died == true){
                    globalVars.lives = globalVars.lives - 1;
                    this.died = false;
                    globalVars.damage.node.getComponent(Sprite).color = new Color(255,255,255,0);
                    globalVars.damageFlash.node.getComponent(Sprite).color = new Color(255,255,255,0);
                    globalVars.currentHealth = globalVars.maxHealth;
                    globalVars.currentgun = 1;
                    globalVars.arms.node.active = true;
                    globalVars.arms.showArms();
                    globalVars.camera.cameraCenter();
                    this.reloadAmmo();
                    this.node.getComponent(RigidBody).wakeUp();
                    this.node.getComponent(CapsuleCollider).on();
                    this.node.setPosition(this.scene.getChildByName("Checkpoints").getChildByName("Checkpoint_"+globalVars.checkpoint).getPosition());
                } else if(globalVars.lives == 0 && globalVars.currentHealth <= 0 && this.end == false) {
                    this.end = true;
                    setTimeout( () => {
                        window.document.exitPointerLock();
                        //globalVars.damageFlash.node.getComponent(Sprite).color = new Color(255,255,255,0);
                        director.loadScene("Menu");
                    }, 10100 );
                }
            }, 1000);
        }
    }
    causeDamage(item){
        if(globalVars.currentHealth > 0){
            if(this.scene.getChildByName("hit").getComponent(AudioSource).playing == false){
                this.scene.getChildByName("hit").getComponent(AudioSource).play("hit.wav");
            }
            globalVars.currentHealth = globalVars.currentHealth - 1;
            globalVars.damageFlash.node.getComponent(Sprite).color = new Color(255,255,255,100);
            setTimeout( () => { globalVars.damageFlash.node.getComponent(Sprite).color = new Color(255,255,255,0); }, 100 );
            //globalVars.character.node.getComponent(RigidBody).applyLocalForce(new Vec3(0,0,2000), this.node.getPosition());
            item.node.getComponent(RigidBody).applyLocalForce(new Vec3(0,0,40), globalVars.character.node.getPosition());
        }
    }
    removeAmmo(amount){
        if(globalVars.currentgun == 1){
            ammoScript.bulletsGun1 = ammoScript.bulletsGun1 - amount;
        } else if(globalVars.currentgun == 2){
            ammoScript.bulletsGun2 = ammoScript.bulletsGun2 - amount;
        } else if(globalVars.currentgun == 3){
            ammoScript.bulletsGun3 = ammoScript.bulletsGun3 - amount;
        } else if(globalVars.currentgun == 4){
            ammoScript.bulletsGun4 = ammoScript.bulletsGun4 - amount;
        }
    }
    reloadAmmo(){
        if(globalVars.currentgun == 1){
            ammoScript.bulletsGun1 = 6;
        } else if(globalVars.currentgun == 2){
            if(parseInt(ammoScript.bulletsGun2-(ammoScript.clipsGun2*Math.floor(ammoScript.totalClipsGun2))) == 0){
                
            } else {
                ammoScript.bulletsGun2 = ammoScript.bulletsGun2 - parseInt(ammoScript.bulletsGun2-(ammoScript.clipsGun2*Math.floor(ammoScript.totalClipsGun2)));
            }
            ammoScript.totalClipsGun2 = ammoScript.totalClipsGun2 - 1;
        } else if(globalVars.currentgun == 3){
            if(parseInt(ammoScript.bulletsGun3-(ammoScript.clipsGun3*Math.floor(ammoScript.totalClipsGun3))) == 0){
                
            } else {
                ammoScript.bulletsGun3 = ammoScript.bulletsGun3 - parseInt(ammoScript.bulletsGun3-(ammoScript.clipsGun3*Math.floor(ammoScript.totalClipsGun3)));
            }
            ammoScript.totalClipsGun3 = ammoScript.totalClipsGun3 - 1;
        } else if(globalVars.currentgun == 4){
            if(parseInt(ammoScript.bulletsGun4-(ammoScript.clipsGun4*Math.floor(ammoScript.totalClipsGun4))) == 0){

            } else {
                ammoScript.bulletsGun4 = ammoScript.bulletsGun4 - parseInt(ammoScript.bulletsGun4-(ammoScript.clipsGun4*Math.floor(ammoScript.totalClipsGun4)));
            }
            ammoScript.totalClipsGun4 = ammoScript.totalClipsGun4 - 1;
        }
    }
}