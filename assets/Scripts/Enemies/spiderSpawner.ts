import { _decorator, Component, Prefab, Vec3, instantiate, director, Node } from 'cc';
import { globalVars } from '../globalVars';
const { ccclass, property } = _decorator;

@ccclass('spiderSpawner')
export class spiderSpawner extends Component {

    public count = 0; 
    public distance = 20;
    public spawnTimer = 2;
    @property(Prefab)
    spiderPrefab: Prefab = null;

    start() {

    }

    update(deltaTime: number) {
        var distance = Vec3.distance(globalVars.camera.node.getWorldPosition(), this.node.getWorldPosition());
        let scene = director.getScene();
        if(distance < this.distance && globalVars.currentHealth > 0){
            if(this.count > (60*this.spawnTimer)){
                var spider = instantiate(this.spiderPrefab);
                spider.parent = scene;
                spider.setPosition(this.node.getWorldPosition());
                spider.setRotation(this.node.getWorldRotation());
                this.count = 0;
            }
            this.count++;
        }
    }
}

