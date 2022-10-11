import { _decorator, director, Animation, math, input, Input, Vec3, Prefab, AudioSource, geometry, Camera, instantiate, ParticleSystem, PhysicsSystem, EventMouse, RigidBody, Component, Node, screen , Quat, Asset, AssetLibrary, resources, color} from 'cc';
import { globalVars } from '../globalVars';
import { ammoScript } from '../ammoScript';
import { cameraScript } from '../cameraScript';
import { PlayerScript } from '../playerScript';
const { ccclass, property } = _decorator;
const { Ray } = geometry;
const shootray = new Ray(0, -1, 0, 0, 1, 0);
const { Color } = math;

@ccclass('armsScript')
export class armsScript extends Component {


    private animState = "idle";
    private shoot = 0;
    private idleCounter = 0;
    private randomTime = 200;
    private damage = 1;

    /* Prefabs */
    @property(Prefab)
    bulletHitPrefab: Prefab = null;
    @property(Prefab)
    bulletHolePrefab: Prefab = null;
    @property(Prefab)
    bloodHitPrefab: Prefab = null;
    @property(Prefab)
    bloodDebrisPrefab: Prefab = null;

    start() {
        globalVars.arms = this;
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.getComponent(Animation).play("HumanFPS|show");
        this.animState = "show";
        this.node.getComponent(Animation).on(Animation.EventType.LASTFRAME, this.finishAnim ,this);
        ammoScript.clipsGun1 = -1;
        ammoScript.bulletsGun1 = 6;
        ammoScript.totalClipsGun1 = ammoScript.bulletsGun1/ammoScript.clipsGun1;
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
        if(globalVars.currentgun == 1){
            var gunPos = this.node.getChildByName("Hand_r Socket").getChildByName("Gun1").getWorldPosition();
            globalVars.muzzleFlash.node.setWorldPosition(gunPos);
            globalVars.muzzleFlash.node.setRotation(this.node.getRotation());
            //globalVars.shadowLight.node.setWorldPosition(this.node.getPosition());
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
        if(parseInt(ammoScript.bulletsGun1) > 0 && globalVars.reload == false){
            if(globalVars.start == 1 && event.getButton() == cc.Event.EventMouse.BUTTON_LEFT && globalVars.currentgun == 1 && (this.animState != "show" || this.animState != "changeWeapon")){
                if(this.shoot == 0){
                    globalVars.light.enableLight();
                    globalVars.light.node.setPosition(globalVars.character.node.getPosition().x,globalVars.character.node.getPosition().y+1,globalVars.character.node.getPosition().z);
                    setTimeout( () => { globalVars.light.disableLight(); }, 200 );
                    this.createBullet();
                    globalVars.character.removeAmmo(1);
                    this.shoot = 1;
                    this.node.getComponent(Animation).play("HumanFPS|shoot", 0.3);
                    this.getComponent(AudioSource).play("pistol.wav");
                    globalVars.muzzleFlash.node.getComponent(ParticleSystem).play();
                    globalVars.muzzleFlash.node.getChildByName("smoke").getComponent(ParticleSystem).stop(); 
                    globalVars.muzzleFlash.node.getChildByName("smoke").getComponent(ParticleSystem).play();
                    this.animState = "shoot";
                    this.idleCounter = 0;
                    globalVars.camera.node.setRotation(new Quat(globalVars.camera.node.getRotation().x,globalVars.camera.node.getRotation().y+10,globalVars.camera.node.getRotation().z,globalVars.camera.node.getRotation().w))
                    setTimeout( () => { this.shoot = 0; }, 800 );
                }
            }
        }
        if(parseInt(ammoScript.bulletsGun1) == 0){
            let scene = director.getScene();
            if(globalVars.start == 1 && event.getButton() == cc.Event.EventMouse.BUTTON_LEFT && globalVars.currentgun == 1 && (this.animState != "show" || this.animState != "changeWeapon")){
                scene.getChildByName("click").getComponent(AudioSource).play("click.wav");
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
                if((value.distance < result.distance) && (value.collider.name == "Map1<MeshCollider>" 
                                                        || value.collider.name == "Plane<MeshCollider>"
                                                        || value.collider.name == "standingLight<MeshCollider>"  
                                                        || value.collider.name == "eyeball<SphereCollider>"  
                                                        || value.collider.name == "eyeball<CylinderCollider>" 
                                                        || value.collider.name.match("<BoxCollider>") 
                                                        || value.collider.name.match("<CylinderCollider>"))){
                    result = value;
                }
            });

            let scene = director.getScene();

            if(result.collider.name == "Map1<MeshCollider>" || result.collider.name == "Plane<MeshCollider>"){
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
            if(result.collider.name == "eyeball<SphereCollider>" || result.collider.name == "eyeball<CylinderCollider>" || result.collider.name == "enemySpider<BoxCollider>"){
                var rot = new Quat;
                Quat.fromViewUp(rot,result.hitNormal,Quat.UP);
                var bloodHit = instantiate(this.bloodHitPrefab);
                //result.collider.node.addChild(bloodHit);
                bloodHit.parent = scene;
                bloodHit.setWorldPosition(result.hitPoint);
                bloodHit.setRotation(rot);
                bloodHit.getChildByName("hitEffect").getComponent(ParticleSystem).play();
                bloodHit.getChildByName("hitEffectSmoke").getComponent(ParticleSystem).play();
                setTimeout( () => { bloodHit.destroy(); }, 400 );

                    if(result.collider.name == "eyeball<SphereCollider>" || result.collider.name == "eyeball<CylinderCollider>"){
                        result.collider.node.getComponent('Eyeball').health = result.collider.node.getComponent('Eyeball').health - this.damage;
                        if(result.collider.name == "eyeball<CylinderCollider>"){
                            result.collider.node.getComponent('Eyeball').health = result.collider.node.getComponent('Eyeball').health - this.damage;
                        }
                    } else if(result.collider.name == "enemySpider<BoxCollider>"){
                        result.collider.node.getComponent('Spider').health = result.collider.node.getComponent('Spider').health - this.damage;
                        result.collider.node.getComponent(AudioSource).play("hit.wav");
                    }

                    let bloodDebris = instantiate(this.bloodDebrisPrefab);
                    result.hitPoint.transformMat4(result.collider.node.getWorldMatrix().invert());
                    result.collider.node.addChild(bloodDebris);
                    bloodDebris.getComponent(ParticleSystem).play();
                    bloodDebris.setPosition(result.hitPoint);
                    bloodDebris.setRotation(rot);
                    setTimeout( () => { bloodDebris.destroy(); }, 3000 );
            } else if(result.collider.name == "standingLight<MeshCollider>" || result.collider.name.match("<BoxCollider>") || result.collider.name.match("<CylinderCollider>")){
                var rot = new Quat;
                Quat.fromViewUp(rot,result.hitNormal,Quat.UP);
                var bulletHit = instantiate(this.bulletHitPrefab);
                bulletHit.parent = scene;
                bulletHit.setPosition(result.hitPoint);
                bulletHit.setRotation(rot);
                bulletHit.getChildByName("hitEffect").getComponent(ParticleSystem).play();
                bulletHit.getChildByName("hitEffectSmoke").getComponent(ParticleSystem).play();
                setTimeout( () => { bulletHit.destroy(); }, 400 );
                var force = 40;
                result.collider.node.getComponent(RigidBody).applyLocalForce(new Vec3(result.hitNormal.x*force,result.hitNormal.y*force,result.hitNormal.z*force), new Vec3(result.hitPoint.x,result.hitPoint.y,result.hitPoint.z));
            }
        }
    }

    reload(){
        if((ammoScript.totalClipsGun1 > 0 ||  ammoScript.clipsGun1 == -1)){
            let scene = director.getScene();
            scene.getChildByName("Arms").getChildByName("revolver_reload").getComponent(AudioSource).play("revolver_reload.wav");
            this.node.getComponent(Animation).play("HumanFPS|hide");
            this.animState = "changeWeapon";
            globalVars.reload = true;
            setTimeout( () => { this.changeToWeapon(); }, 2300 );
            setTimeout( () => { globalVars.character.reloadAmmo(); }, 2600 );
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
            if(globalVars.currentgun == 2){
                globalVars.arms2.changeToWeapon();
            } else if(globalVars.currentgun == 3) {
                globalVars.arms3.changeToWeapon();
            } else if(globalVars.currentgun == 4) {
                globalVars.arms4.changeToWeapon();
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

    showArms(){
        this.node.getComponent(Animation).play("HumanFPS|show");
        this.animState = "show"; 
    }
    
}

