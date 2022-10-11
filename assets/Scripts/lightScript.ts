import { _decorator, Component, Light, SphereLight, Node, renderer } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('lightScript')
export class lightScript extends Component {

    public count = 0; 
    update() {
        if(this.count > 5){
                //this.node.getChildByName("standingLight").getChildByName("flame").active = true;
                this.node.getChildByName("standingLight").getChildByName("Light").getComponent(Light).luminance = Math.floor(Math.random() * (600 - 449 + 1) + 449);
            this.count = 0;
        }
        this.count++;
    }
}

