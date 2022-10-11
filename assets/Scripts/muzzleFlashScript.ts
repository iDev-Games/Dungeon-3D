import { _decorator, Component, Node } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('muzzleFlashScript')
export class muzzleFlashScript extends Component {
    start() {
        globalVars.muzzleFlash = this;
    }
}

