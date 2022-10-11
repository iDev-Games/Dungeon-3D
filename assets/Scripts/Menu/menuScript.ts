import { _decorator, director, Color, Component, Sprite, Node, view, Canvas, ResolutionPolicy, Label, AudioSource  } from 'cc';
import { globalVars } from '../globalVars';
const { ccclass, property } = _decorator;

@ccclass('menu')
export class menu extends Component {

    /* Local Variables */

    private scene;
    public count = 0; 
    private fadein = true;
    private fadeinCocos = false;
    private introFinished = false;
    private cocosLogo = false;
    private loadedMenu = false;

    /* End Local Variables */

    start() {
        this.scene = director.getScene();
        this.scene.getChildByName("Main Camera").setPosition(-10,66,-106);
        this.scene.getChildByName("Main Camera");
        this.scene.getChildByName("Canvas").getChildByName("Presents").getComponent(Sprite).color = new Color(255,255,255,0);
        this.scene.getChildByName("Canvas").getChildByName("Cocos").getComponent(Sprite).color = new Color(255,255,255,0);
        view.setResolutionPolicy(cc.ResolutionPolicy.SHOW_ALL);
        this.scene.getChildByName("Canvas").getChildByName("MainMenu").active = false;
        this.scene.getChildByName("Canvas").getChildByName("Loading").active = false;
        setTimeout( () => {
            director.getScene().getChildByName("rainSound").getComponent(AudioSource).play("rain.wav");
            director.getScene().getChildByName("menuMusic").getComponent(AudioSource).play("menuMusic.wav");
        }, 1020 );
        //view.resizeWithBrowserSize(true);
        //this.updateResolution();
    }

    update(deltaTime: number) {
        var speed = 5;
        var alphaPercent = (this.scene.getChildByName("Canvas").getChildByName("Presents").getComponent(Sprite).color.a/255 * 100);
        var alphaPercent2 = (this.scene.getChildByName("Canvas").getChildByName("Cocos").getComponent(Sprite).color.a/255 * 100);
        if(this.fadein == true){
            if(alphaPercent < 90){
            this.scene.getChildByName("Canvas").getChildByName("Presents").getComponent(Sprite).color = new Color(255,255,255,this.scene.getChildByName("Canvas").getChildByName("Presents").getComponent(Sprite).color.a+speed);
            } else {
                setTimeout( () => { this.fadein = false; }, 1400 );
            }
        } 
        if(this.fadein == false) {
            if(alphaPercent > 0){
            this.scene.getChildByName("Canvas").getChildByName("Presents").getComponent(Sprite).color = new Color(255,255,255,this.scene.getChildByName("Canvas").getChildByName("Presents").getComponent(Sprite).color.a-speed);
            } else {
                setTimeout( () => { this.fadeinCocos = true; }, 1400 );
            }
        }
        if(this.fadeinCocos == true && this.introFinished == false) {
            if(alphaPercent2 < 90){
            this.scene.getChildByName("Canvas").getChildByName("Cocos").getComponent(Sprite).color = new Color(255,255,255,this.scene.getChildByName("Canvas").getChildByName("Cocos").getComponent(Sprite).color.a+speed);
            } else {
                setTimeout( () => { this.fadeinCocos = false; this.cocosLogo = true; }, 1400 );
            }
        }
        if(this.fadeinCocos == false && this.cocosLogo == true) {
            if(alphaPercent2 > 0){
            this.scene.getChildByName("Canvas").getChildByName("Cocos").getComponent(Sprite).color = new Color(255,255,255,this.scene.getChildByName("Canvas").getChildByName("Cocos").getComponent(Sprite).color.a-speed);
            } else {
                this.introFinished = true;
                //this.fadeinCocos = true;
            }
        }
        if(this.count > (60*5)){
            //this.node.getChildByName("standingLight").getChildByName("flame").active = true;
            if(this.scene.getChildByName("Main Camera").getPosition().y > 0){
                this.scene.getChildByName("Main Camera").setPosition(-10,this.scene.getChildByName("Main Camera").getPosition().y - 0.2,-106);
            } else {
                if(this.loadedMenu == false){
                    this.scene.getChildByName("Canvas").getChildByName("MainMenu").active = true;   
                }
                this.loadedMenu = true;
            }
        }
        this.count++;
    }

    updateResolution(width = 1920, height = 1080){
        view.setDesignResolutionSize(width, height, 4);
    }
}

