import { _decorator, director, Animation, input, Input, Vec3, Prefab, AudioSource, geometry, Camera, instantiate, ParticleSystem, RigidBody, PhysicsSystem, EventMouse, Component, Node, screen , Quat} from 'cc';
import { globalVars } from '../globalVars';
import { ammoScript } from '../ammoScript';
import { cameraScript } from '../cameraScript';
const { ccclass, property } = _decorator;
const { Ray } = geometry;
const shootray = new Ray(0, -1, 0, 0, 1, 0);

@ccclass('arms3Script')
export class arms3Script extends Component {


    private animState = "idle";
    private shoot = 0;
    private idleCounter = 0;
    private randomTime = 200;
    private fireRate = 3;
    private damage = 5;

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
        globalVars.arms3 = this;
        this.node.active = false;
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.getComponent(Animation).on(Animation.EventType.LASTFRAME, this.finishAnim ,this);
        ammoScript.clipsGun3 = 2;
        ammoScript.bulletsGun3 = 12;
        ammoScript.totalClipsGun3 = ammoScript.bulletsGun3/ammoScript.clipsGun3;
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
        if(globalVars.currentgun == 3){
            let scene = director.getScene();
            globalVars.muzzleFlashShotgun.node.setWorldPosition(this.node.getChildByName("Hand_r Socket").getChildByName("Gun3").getWorldPosition());
            globalVars.muzzleFlashShotgun.node.setRotation(this.node.getRotation());
            //scene.getChildByName("Lighting").setPosition(globalVars.muzzleFlash.node.getWorldPosition());
            //scene.getChildByName("Lighting").setRotation(globalVars.camera.node.getRotation());
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
        if(parseInt(ammoScript.bulletsGun3-(ammoScript.clipsGun3*Math.floor(ammoScript.totalClipsGun3))) > 0 && globalVars.reload == false){
            if(globalVars.start == 1 && event.getButton() == cc.Event.EventMouse.BUTTON_LEFT && globalVars.currentgun == 3 && (this.animState != "show" || this.animState != "changeWeapon")){
                if(this.shoot == 0){
                    globalVars.light.enableLight();
                    globalVars.light.node.setPosition(globalVars.character.node.getPosition().x,globalVars.character.node.getPosition().y+1,globalVars.character.node.getPosition().z);
                    setTimeout( () => { globalVars.light.disableLight(); }, 200 );
                    this.createBullet();
                    this.shoot = 1;
                    this.node.getComponent(Animation).play("HumanFPS|shoot", 0.3);
                    this.getComponent(AudioSource).play("shotgun.wav");
                    globalVars.character.removeAmmo(1);
                    globalVars.muzzleFlashShotgun.node.getChildByName("Flash").getComponent(ParticleSystem).play();
                    if(globalVars.muzzleFlashShotgun.node.getChildByName("Flash").getChildByName("smoke").getComponent(ParticleSystem).isEmitting == true){
                        globalVars.muzzleFlashShotgun.node.getChildByName("Flash").getChildByName("smoke").getComponent(ParticleSystem).stop(); 
                    }
                    globalVars.muzzleFlashShotgun.node.getChildByName("Flash").getChildByName("smoke").getComponent(ParticleSystem).play();
                    if(globalVars.muzzleFlashShotgun.node.getChildByName("Flash-001").getChildByName("smoke").getComponent(ParticleSystem).isEmitting == true){
                        globalVars.muzzleFlashShotgun.node.getChildByName("Flash-001").getChildByName("smoke").getComponent(ParticleSystem).stop(); 
                    }
                    globalVars.muzzleFlashShotgun.node.getChildByName("Flash-001").getComponent(ParticleSystem).play();
                    globalVars.muzzleFlashShotgun.node.getChildByName("Flash-001").getChildByName("smoke").getComponent(ParticleSystem).play();
                    this.animState = "shoot";
                    this.idleCounter = 0;
                    setTimeout( () => { this.shoot = 0; }, 800 );
                }
            }
        } 
        if(parseInt(ammoScript.bulletsGun3-(ammoScript.clipsGun3*Math.floor(ammoScript.totalClipsGun3))) == 0) {
            if(globalVars.start == 1 && event.getButton() == cc.Event.EventMouse.BUTTON_LEFT && globalVars.currentgun == 3 && (this.animState != "show" || this.animState != "changeWeapon")){
                let scene = director.getScene();
                scene.getChildByName("click").getComponent(AudioSource).play("click.wav");
            }
        }
    }

    createBullet(){
        
            var r = new Array();
            for (let i = 0; i < this.fireRate; i++) {
                if(i % 2 == 0){
                    var rand = Math.floor(Math.random() * 10);
                    if(i == 0){
                        globalVars.camera.node.getComponent(Camera).screenPointToRay((screen.windowSize.width/2) ,(screen.windowSize.height/2), shootray);
                    } else if(rand % 2 == 0){
                        globalVars.camera.node.getComponent(Camera).screenPointToRay((screen.windowSize.width/2)-(Math.floor(Math.random() * 20)) ,(screen.windowSize.height/2)+(Math.floor(Math.random() * 20)), shootray);
                    } else {
                        globalVars.camera.node.getComponent(Camera).screenPointToRay((screen.windowSize.width/2)-(Math.floor(Math.random() * 20)) ,(screen.windowSize.height/2)-(Math.floor(Math.random() * 20)), shootray);
                    }
                } else {
                    var rand = Math.floor(Math.random() * 10);
                    if(rand % 2 == 0){
                        globalVars.camera.node.getComponent(Camera).screenPointToRay((screen.windowSize.width/2)+(Math.floor(Math.random() * 20)) ,(screen.windowSize.height/2)-(Math.floor(Math.random() * 20)), shootray);
                    } else {
                        globalVars.camera.node.getComponent(Camera).screenPointToRay((screen.windowSize.width/2)+(Math.floor(Math.random() * 20)) ,(screen.windowSize.height/2)+(Math.floor(Math.random() * 20)), shootray);
                    }
                }
                
                if (PhysicsSystem.instance.raycast(shootray)) {
                    r[i] = PhysicsSystem.instance.raycastResults;
        
                    var result = new Array();
                    var s = 0;

                        r.forEach(function (value1) {
                            var first = 0;
                            value1.forEach(function (value) {
                                if(first == 0){
                                    result[s] = value;
                                    first = 1;
                                }
                                if((value.distance < result[s].distance) && (value.collider.name == "Map1<MeshCollider>" 
                                                                            || value.collider.name == "Plane<MeshCollider>"
                                                                            || value.collider.name == "standingLight<MeshCollider>"  
                                                                            || value.collider.name == "eyeball<SphereCollider>"  
                                                                            || value.collider.name == "eyeball<CylinderCollider>" 
                                                                            || value.collider.name.match("<BoxCollider>") 
                                                                            || value.collider.name.match("<CylinderCollider>"))){
                                    result[s] = value;
                                }
                            });
                            s++;
                        });

                    var prefabs = this;
                    let scene = director.getScene();
                    result.forEach(function (value) {
                        if(value.collider.name == "Map1<MeshCollider>" || value.collider.name == "Plane<MeshCollider>"){
                            var bulletHit = instantiate(prefabs.bulletHitPrefab);
                            var rot = new Quat;
                            Quat.fromViewUp(rot,value.hitNormal,Quat.UP);
                            bulletHit.parent = scene;
                            bulletHit.setPosition(value.hitPoint);
                            bulletHit.setRotation(rot);
                            bulletHit.getChildByName("hitEffect").getComponent(ParticleSystem).play();
                            bulletHit.getChildByName("hitEffectSmoke").getComponent(ParticleSystem).play();
                            setTimeout( () => { bulletHit.destroy(); }, 400 );

                            let bulletHole = instantiate(prefabs.bulletHolePrefab);
                            bulletHole.parent = scene;
                            //bulletHole.getComponent(AudioSource).play("machinegun.wav");
                            bulletHole.setPosition(value.hitPoint);
                            bulletHole.setRotation(rot);
                        }

                        if(value.collider.name.match("eyeball<SphereCollider>") || value.collider.name == "eyeball<CylinderCollider>"  || value.collider.name == "enemySpider<BoxCollider>"){
                            var rot = new Quat;
                            Quat.fromViewUp(rot,value.hitNormal,Quat.UP);
                            var bloodHit = instantiate(prefabs.bloodHitPrefab);
                            //value.collider.node.addChild(bloodHit);
                            bloodHit.parent = scene;
                            bloodHit.setWorldPosition(value.hitPoint);
                            bloodHit.setRotation(rot);
                            bloodHit.getChildByName("hitEffect").getComponent(ParticleSystem).play();
                            bloodHit.getChildByName("hitEffectSmoke").getComponent(ParticleSystem).play();
                            setTimeout( () => { bloodHit.destroy(); }, 400 );
            
                                if(value.collider.name == "eyeball<SphereCollider>" || value.collider.name == "eyeball<CylinderCollider>"){
                                    value.collider.node.getComponent('Eyeball').health = value.collider.node.getComponent('Eyeball').health - prefabs.damage;
                                    if(value.collider.name == "eyeball<CylinderCollider>"){
                                        value.collider.node.getComponent('Eyeball').health = value.collider.node.getComponent('Eyeball').health - prefabs.damage;
                                    }
                                } else if(value.collider.name == "enemySpider<BoxCollider>"){
                                    value.collider.node.getComponent('Spider').health = value.collider.node.getComponent('Spider').health - prefabs.damage;
                                }
            
                                let bloodDebris = instantiate(prefabs.bloodDebrisPrefab);
                                value.hitPoint.transformMat4(value.collider.node.getWorldMatrix().invert());
                                value.collider.node.addChild(bloodDebris);
                                bloodDebris.getComponent(ParticleSystem).play();
                                bloodDebris.setPosition(value.hitPoint);
                                bloodDebris.setRotation(rot);
                                setTimeout( () => { bloodDebris.destroy(); }, 3000 );
                        } else if(value.collider.name == "standingLight<MeshCollider>"  || value.collider.name.match("<BoxCollider>") || value.collider.name.match("<CylinderCollider>")){
                            var rot = new Quat;
                            Quat.fromViewUp(rot,value.hitNormal,Quat.UP);
                            var bulletHit = instantiate(prefabs.bulletHitPrefab);
                            bulletHit.parent = scene;
                            bulletHit.setPosition(value.hitPoint);
                            bulletHit.setRotation(rot);
                            bulletHit.getChildByName("hitEffect").getComponent(ParticleSystem).play();
                            bulletHit.getChildByName("hitEffectSmoke").getComponent(ParticleSystem).play();
                            setTimeout( () => { bulletHit.destroy(); }, 400 );
                            var force = 40;
                            value.collider.node.getComponent(RigidBody).applyLocalForce(new Vec3(value.hitNormal.x*force,value.hitNormal.y*force,value.hitNormal.z*force), new Vec3(value.hitPoint.x,value.hitPoint.y,value.hitPoint.z));
                        }
                    });
                }
        }
    }

    reload(){
        if(ammoScript.totalClipsGun3 > 0 ||  ammoScript.clipsGun3 == -1){
            let scene = director.getScene();
            scene.getChildByName("Arms").getChildByName("shotgun_reload").getComponent(AudioSource).play("shotgun_reload.wav");
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
            } else if(globalVars.currentgun == 4) {
                globalVars.arms4.changeToWeapon();
            }
         }, 300 );
    }

    changeToWeapon(){
        this.node.active = true;
        this.node.getComponent(Animation).play("HumanFPS|show");
        this.animState = "show";
        setTimeout( () => { globalVars.muzzleFlashShotgun.node.getChildByName("Flash-001").getChildByName("smoke").getComponent(ParticleSystem).stop(); globalVars.muzzleFlashShotgun.node.getChildByName("Flash").getChildByName("smoke").getComponent(ParticleSystem).stop(); }, 1400 );
        setTimeout( () => { 
            if(this.animState == "show"){
                globalVars.reload = false;
                this.node.getComponent(Animation).play("HumanFPS|Idle");
                this.animState = "idle";
            }
        }, 1800 );   
    }
    
}

