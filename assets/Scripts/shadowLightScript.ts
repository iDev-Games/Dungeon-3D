import { _decorator, Component, Node } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('shadowLightScript')
export class shadowLightScript extends Component {
    start() {
        globalVars.shadowLight = this;
    }

    update(deltaTime: number) {
        
    }
}

