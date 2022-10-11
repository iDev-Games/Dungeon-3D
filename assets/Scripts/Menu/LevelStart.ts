import { _decorator, director, Component, Input, Node, Label, UITransform, Size } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelStart')
export class LevelStart extends Component {

     /* Local Variables */

     private scene;
     private loadingScene = "";

     /* End Local Variables */
     
    start() {
        this.scene = director.getScene();
        this.scene.getChildByName("Canvas").getChildByName("Loading").getChildByName("loadingBar").getComponent(UITransform).setContentSize(0, 4);
        this.node.on(Input.EventType.MOUSE_UP, this.clicked, this);
    }

    update(deltaTime: number) {
        
    }

    clicked(event:EventMouse){
        this.loadLevel("Level1");
    }
    loadLevel(levelToLoad){
        this.scene.getChildByName("Canvas").getChildByName("MainMenu").active = false;
        this.scene.getChildByName("Canvas").getChildByName("Loading").active = true;
        this.loadingScene = levelToLoad;
        director.preloadScene(levelToLoad,(completedCount: number, totalCount: number, item: any)=>  {

        let percent = 0;
        if (totalCount > 0) {
            percent = 100 * completedCount / totalCount;
        }
        this.scene.getChildByName("Canvas").getChildByName("Loading").getChildByName("loadingLabel").getComponent(Label).string = parseInt(percent)+"%";
        this.scene.getChildByName("Canvas").getChildByName("Loading").getChildByName("loadingBar").getComponent(UITransform).setContentSize(new Size(parseInt(percent), 4));

        },(error: null | Error, sceneAsset?: SceneAsset) =>{

            director.loadScene(levelToLoad);
    
        });
    }
}

