import { _decorator, director, Animation, input, Input, Vec3, Prefab, AudioSource, geometry, Camera, instantiate, ParticleSystem, PhysicsSystem, EventMouse, Component, Node, screen , Quat} from 'cc';
import { globalVars } from '../globalVars';
import { ammoScript } from '../ammoScript';
import { cameraScript } from '../cameraScript';
const { ccclass, property } = _decorator;
const { Ray } = geometry;
const shootray = new Ray(0, -1, 0, 0, 1, 0);

@ccclass('arms4Script')
export class arms4Script extends Component {


    private animState = "idle";
    private shoot = 0;
    private idleCounter = 0;
    private randomTime = 200;

    /* Prefabs */
    @property(Prefab)
    bulletHitPrefab: Prefab = null;
    @property(Prefab)
    bulletHolePrefab: Prefab = null;

    start() {
        globalVars.arms4 = this;
        this.node.active = false;
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.getComponent(Animation).on(Animation.EventType.LASTFRAME, this.finishAnim ,this);
        ammoScript.clipsGun4 = 2;
        ammoScript.bulletsGun4 = 12;
        ammoScript.totalClipsGun4 = ammoScript.bulletsGun4/ammoScript.clipsGun4;
    }

    update(deltaTime: number) {
        if(globalVars.moving == 1 && this.animState == "idle"){
            this.node.getComponent(Animation).play("HumanFPS|run");
            this.animState = "run";
        } else if(globalVars.moving == 0 && this.animState == "run") {
            this.node.getComponent(Animation).play("HumanFPS|Idle");
            this.animState = "idle";
            this.randomTime = Math.floor(Math.random() * 800);
        }

        if(this.animState == "idle"){
                this.idleCounter++;
                if(this.idleCounter >= this.randomTime){
                    this.node.getComponent(Animation).play("HumanFPS|IdleBreak");
                    this.animState = "idleBreak";
                }
        }
        if(globalVars.currentgun == 4){
            let scene = director.getScene();
            globalVars.muzzleFlash.node.setPosition(this.node.getChildByName("Hand_r Socket").getChildByName("Gun4").getWorldPosition());
            globalVars.muzzleFlash.node.setRotation(this.node.getRotation());
        }
    }

    finishAnim(){
        if(this.animState == "shoot" || this.animState == "show"){
            this.node.getComponent(Animation).play("HumanFPS|Idle");
            this.animState = "idle";
        }
        if(this.animState == "idleBreak"){
            this.idleCounter = 0;
            this.randomTime = Math.floor(Math.random() * 800);
            this.node.getComponent(Animation).play("HumanFPS|Idle");
            this.animState = "idle";
        }
    }

    onMouseDown(event: EventMouse){
        if(parseInt(ammoScript.bulletsGun4-(ammoScript.clipsGun4*Math.floor(ammoScript.totalClipsGun4))) > 0 && globalVars.reload == false){
            if(globalVars.start == 1 && event.getButton() == cc.Event.EventMouse.BUTTON_LEFT && globalVars.currentgun == 4 && (this.animState != "show" || this.animState != "changeWeapon")){
                if(this.shoot == 0){
                    globalVars.light.enableLight();
                    globalVars.light.node.setPosition(globalVars.character.node.getPosition().x,globalVars.character.node.getPosition().y+1,globalVars.character.node.getPosition().z);
                    setTimeout( () => { globalVars.light.disableLight(); }, 200 );
                    this.createBullet();
                    this.shoot = 1;
                    this.node.getComponent(Animation).play("HumanFPS|shoot", 0.3);
                    this.getComponent(AudioSource).play("launcher.wav");
                    globalVars.character.removeAmmo(1);
                    globalVars.muzzleFlash.node.getComponent(ParticleSystem).play();
                    globalVars.muzzleFlash.node.getChildByName("smoke").getComponent(ParticleSystem).play();
                    this.animState = "shoot";
                    this.idleCounter = 0;
                    setTimeout( () => { this.shoot = 0; }, 800 );
                }
            }
        }
    }

    createBullet(){
        var bullet = globalVars.camera.node.getComponent(Camera).screenPointToRay(screen.windowSize.width/2 ,screen.windowSize.height/2, shootray);
        
        if (PhysicsSystem.instance.raycast(shootray)) {
            const r = PhysicsSystem.instance.raycastResults;
            var result;
            var first = 0;
            r.forEach(function (value) {
                if(first == 0){
                    result = value;
                    first = 1;
                }
                if((value.distance < result.distance) && value.collider.name == "Map1<MeshCollider>"){
                    result = value;
                }
            });

            if(result.collider.name == "Map1<MeshCollider>"){
                let scene = director.getScene();
                var bulletHit = instantiate(this.bulletHitPrefab);
                var rot = new Quat;
                Quat.fromViewUp(rot,result.hitNormal,Quat.UP);
                bulletHit.parent = scene;
                bulletHit.setPosition(result.hitPoint);
                bulletHit.setRotation(rot);
                bulletHit.getChildByName("hitEffect").getComponent(ParticleSystem).play();
                bulletHit.getChildByName("hitEffectSmoke").getComponent(ParticleSystem).play();
                setTimeout( () => { bulletHit.destroy(); }, 400 );

                let bulletHole = instantiate(this.bulletHolePrefab);
                bulletHole.parent = scene;
                bulletHole.getComponent(AudioSource).play("machinegun.wav");
                bulletHole.setPosition(result.hitPoint);
                bulletHole.setRotation(rot);
            }
        }
    }

    reload(){
        if(ammoScript.totalClipsGun4 > 0 ||  ammoScript.clipsGun4 == -1){
            this.node.getComponent(Animation).play("HumanFPS|hide");
            this.animState = "changeWeapon";
            globalVars.reload = true;
            setTimeout( () => { this.changeToWeapon(); }, 300 );
            setTimeout( () => { globalVars.character.reloadAmmo(); }, 1600 );
        }
    }

    changeWeapon(){
        globalVars.reload = true;
        if(this.animState != "show"){
            this.node.getComponent(Animation).play("HumanFPS|hide");
            this.animState = "changeWeapon";
        }
        setTimeout( () => { 
            this.node.active = false;
            if(globalVars.currentgun == 1){
                globalVars.arms.changeToWeapon();
            } else if(globalVars.currentgun == 2) {
                globalVars.arms2.changeToWeapon();
            } else if(globalVars.currentgun == 3) {
                globalVars.arms3.changeToWeapon();
            }
         }, 300 );
    }

    changeToWeapon(){
        this.node.active = true;
        this.node.getComponent(Animation).play("HumanFPS|show");
        this.animState = "show";
        setTimeout( () => { globalVars.muzzleFlash.node.getChildByName("smoke").getComponent(ParticleSystem).stop(); }, 1400 );
        setTimeout( () => { 
            if(this.animState == "show"){
                globalVars.reload = false;
                this.node.getComponent(Animation).play("HumanFPS|Idle");
                this.animState = "idle";
            }
        }, 1800 );   
    }
    
}

