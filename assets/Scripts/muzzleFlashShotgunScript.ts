import { _decorator, Component, Node } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('muzzleFlashShotgunScript')
export class muzzleFlashShotgunScript extends Component {
    start() {
        globalVars.muzzleFlashShotgun = this;
    }
}

