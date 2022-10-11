import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('globalVars')
export class globalVars extends Component {
    
    /* Global Variables */

        public version;
        public character;
        public camera;
        public light;
        public shadowLight;
        public arms;
        public arms2;
        public arms3;
        public arms4;
        public reload;
        public maxHealth = 100;
        public currentHealth = 10;
        public damageFlash;
        public damage;
        public muzzleFlash;
        public muzzleFlashShotgun;
        public bulletHit;
        public HealthBar;
        public HealthLabel;
        public LivesLabel;
        public AmmoLabel;
        public currentgun = 1;
        public checkpoint = 1;
        public lives = 1;
        public start = 0;
        public moving = 0;
        public mouseX = 0;
        public mouseY = 0;
        public timer = 0;

    /* End Global Variables */ 
}