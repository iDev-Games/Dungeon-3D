import { _decorator, Component, screen, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('aimDot')
export class aimDot extends Component {
    start() {

    }

    update(deltaTime: number) {
        this.node.setPosition(screen.windowSize.width/2 ,screen.windowSize.height/2);
    }
}

