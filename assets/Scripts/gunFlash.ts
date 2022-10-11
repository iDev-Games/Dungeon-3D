import { _decorator, Component, Light, SphereLight, Node } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('gunFlash')
export class gunFlash extends Component {
    start() {
        globalVars.light = this;
        this.node.active = false;
    }
    enableLight(){
        this.node.active = true;
    }
    disableLight(){
        this.node.active = false;
    }
}

