class MenuScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'MenuScene' });
	}
    preload(){
        this.load.spritesheet('default_knight', '/static/js/images/default_knight.png', {
            frameWidth: 420,  // The width of each frame in the spritesheet
            frameHeight: 320  // The height of each frame in the spritesheet
        });
        this.load.image('knight_halo','/static/js/images/knight_halo.png');


        this.load.spritesheet('findmatch-button', '/static/js/images/findmatch-button.png', {
            frameWidth: 300,  
            frameHeight: 39 
        });
        this.load.image('platform1','/static/js/images/platform1.png');
        this.load.image('platform2','/static/js/images/platform2.png');
        

        this.load.image('menu-title','/static/js/images/menu-title.png');
        this.load.image('menu-grass','/static/js/images/menu-grass.png');
        this.load.image('menu-background','/static/js/images/menu-background.png');
        this.load.image('menu-sun','/static/js/images/menu-sun.png');
        this.load.spritesheet('menu-logoutbutton','static/js/images/menu-logoutbutton.png', {
            frameWidth: 300,  
            frameHeight: 60
        });


        this.load.image('avatar0','/static/js/images/avatar0.png');
        this.load.image('avatar1','/static/js/images/avatar1.png');
        this.load.image('match-found','/static/js/images/match-found.png');
        this.load.image('match-heart','/static/js/images/match-heart.png');
        this.load.spritesheet('match-searching', '/static/js/images/match-searching.png', {
            frameWidth: 700,  
            frameHeight: 80 
        });


        this.load.image('bronzeRankIcon','/static/js/images/bronzeRankIcon.png');
        this.load.image('silverRankIcon','/static/js/images/silverRankIcon.png');
        this.load.image('goldRankIcon','/static/js/images/goldRankIcon.png');
        this.load.image('diamondRankIcon','/static/js/images/diamondRankIcon.png');
        this.load.image('rubyRankIcon','/static/js/images/rubyRankIcon.png');


        this.load.image('battlefield-background','/static/js/images/battlefield-background.png');
        this.load.image('nametag-background','/static/js/images/nametag-background.png');


        this.load.image('40x40','/static/js/images/40x40_block.png');
    }
    create(){
        var scene = this;
        this.add.sprite(0,0,'menu-background').setOrigin(0,0); //Image by freepik
        
        var sun = this.physics.add.sprite(800,40,"menu-sun").setOrigin(0,0);

        this.add.sprite(50,100,'menu-title').setOrigin(0,0);

        var findMatchButton = this.add.sprite(50,250,"findmatch-button").setOrigin(0,0).setInteractive();
        this.anims.create({
            key: 'animate',
            frames: this.anims.generateFrameNumbers('findmatch-button', { start: 1, end: 6 }),
            frameRate: 30,
        });
        this.anims.create({
            key: 'findmatch-button-idle',
            frames: this.anims.generateFrameNumbers('findmatch-button', { start: 0, end: 0 }),
            frameRate: 1,
        });
        findMatchButton.on('pointerdown', function () {
            scene.scene.start("MatchScene");
        });
        findMatchButton.on('pointerover', function () {
            findMatchButton.anims.play("animate");
        });
        findMatchButton.on('pointerout', function () {
            findMatchButton.anims.play("findmatch-button-idle");
        });

        console.log(playerRating);
        

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('default_knight', { start: 1, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
        
        var knight = this.add.sprite(900,500,'default_knight').setScale(0.5);
        knight.anims.play("walk",true);
        
        sun.body.velocity.x = -200;
        sun.body.setAllowGravity(false);

        var grass_array = [];
        for(var i = 0; i < 20; i++){
            var grass = scene.physics.add.sprite(Math.ceil(Math.random()*1170),Math.ceil(Math.random()*90)+510,"menu-grass").setOrigin(0,0);
            grass.body.velocity.x = -500;
            grass.body.setAllowGravity(false);
            grass_array.push(grass);
        }
       
        scene.time.addEvent({
            delay: 100,
            callback: ()=>{
                if(sun.x < -1000){
                    sun.x = 1300;
                }
                for(var i = 0 ; i < grass_array.length; i++){
                    if(grass_array[i].x < -50){
                        grass_array[i].x = 1250;
                        grass_array[i].y = Math.ceil(Math.random()*90)+510
                    }
                }
            },
            callbackScope: this,
            repeat: -1
        });

        var logoutButton = this.add.sprite(970,600,"menu-logoutbutton").setOrigin(0,0).setScale(0.7).setInteractive().setAlpha(0.8);
        logoutButton.on('pointerdown', function () {
            window.location = "/logout";
        });
        logoutButton.on('pointerover', function () {
            logoutButton.setFrame(1);
        });
        logoutButton.on('pointerout', function () {
            logoutButton.setFrame(0);
        });
    }
    update(){
       
    }
}
