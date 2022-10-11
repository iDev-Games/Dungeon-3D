import { _decorator, Component, Node } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('damageFlash')
export class damageFlash extends Component {
    start() {
        globalVars.damageFlash = this;
    }

    update(deltaTime: number) {
        
    }
}

