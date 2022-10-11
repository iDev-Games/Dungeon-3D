import { _decorator, Component, Node, tween, Sprite, Color, UITransform, Size, Label  } from 'cc';
import { globalVars } from './globalVars';
const { ccclass, property } = _decorator;

@ccclass('damage')
export class damage extends Component {

    private fadein = false;

    start() {
        globalVars.damage = this;
        this.node.getComponent(Sprite).color = new Color(255,255,255,0);
    }

    update(deltaTime: number) {
        var healthPercent = (globalVars.currentHealth/globalVars.maxHealth * 100);
        var alphaPercent = (this.node.getComponent(Sprite).color.a/255 * 100);
        var speed = (globalVars.maxHealth/globalVars.currentHealth / 2) * 2;
        const uiTransform = globalVars.HealthBar.getComponent(UITransform);

        uiTransform.setContentSize(new Size(healthPercent, 4));
        globalVars.HealthLabel.getComponent(Label).string = parseInt(healthPercent)+"%";
        globalVars.LivesLabel.getComponent(Label).string = globalVars.lives+" Lives";

        if(speed > 10){
            speed = 10;
        }
        if(healthPercent < 50){
            if(this.fadein == true){
                this.node.getComponent(Sprite).color = new Color(255,255,255,this.node.getComponent(Sprite).color.a-speed);
                if(this.node.getComponent(Sprite).color.a < 10){
                    this.fadein = false;
                }
            } else if(this.fadein == false) {
                this.node.getComponent(Sprite).color = new Color(255,255,255,this.node.getComponent(Sprite).color.a+speed);
                if(alphaPercent > 90){
                    this.fadein = true;
                }
            }
        }
    }
}

