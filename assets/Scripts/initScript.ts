import { _decorator, director, Component, Node, Label } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('initScript')
export class initScript extends Component {

     /* Local Variables */

    private scene;

    /* End Local Variables */

    start() {
        this.scene = director.getScene();
        globalVars.version = "0.2 Alpha";


        this.scene.getChildByName("Canvas").getChildByName("MainMenu").getChildByName("Version").getComponent(Label).string = "V "+globalVars.version;
    }

    update(deltaTime: number) {
        
    }
}

