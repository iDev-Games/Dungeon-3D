import { _decorator, Label, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ammoScript')
export class ammoScript extends Component {

    public clipsGun1 = -1;
    public bulletsGun1 = 6;
    public totalClipsGun1;
    public clipsGun2 = 0;
    public bulletsGun2 = 0;
    public totalClipsGun2;
    public clipsGun3 = -0;
    public bulletsGun3 = 0;
    public totalClipsGun3;
    public clipsGun4 = -0;
    public bulletsGun4 = 0;
    public totalClipsGun4;

}

