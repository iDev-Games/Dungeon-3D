import { _decorator, Component, AudioSource, Node } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('bulletHit')
export class bulletHit extends Component {
    start() {
        globalVars.bulletHit = this;
    }
}

