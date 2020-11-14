"use strict"

// ОБЪЕКТ ГЕРОЙ

function Hero() {
    var self = this;
    //размещаем героя
    self.posX = heroDimension/4;
    self.posY = displaySettings.height/2 - heroDimension/2;
    //скорость пока нулевая, при нажатии клавиш будет меняться
    self.speedX = 0;
    self.speedY = 0;
    self.life = 4;
    // self.bang = 3;

    //метод для передвижения героя ТУТ ВСЁ КАК С МЯЧИКОМ В ТЕННИСЕ =)
    self.moveHero = function () {
        //перемещаем героя добавляя ему скорость 
        self.posX += self.speedX;
        self.posY += self.speedY;

        // обрабатываем крайние положения и при их достижении останавливаем на них героя
        if (self.posX <= displaySettings.left) self.posX = displaySettings.left;
        if (self.posX + heroDimension > displaySettings.width) self.posX = displaySettings.width - heroDimension;
        if (self.posY + heroDimension > displaySettings.height) self.posY = displaySettings.height - heroDimension;
        if (self.posY < displaySettings.top) self.posY = displaySettings.top;
    }

    //метод для отрисовки героя
    self.drawHero = function () {

        // рисуем корабль
        ctx.drawImage(heroDisplay, self.posX, self.posY, heroDimension, heroDimension);
        ctx.fillStyle = "blue";
    }
}

// ОБЪЕКТ ВРАГ

function Enemy() {
    let self = this;
    self.currentEnemy;
    var currentEnemyImg;
    // self.fr1 = 0;
    // self.fr2 = 0;
    // self.fr3 = 0;
  
    self.create = function () {
        //создаём объект врага и добавляем его в массив для учёта врагов
        self.currentEnemy = {};
        self.currentEnemy.size = enemyDimension;
        self.currentEnemy.coordX = displaySettings.width-enemyDimension;
        self.currentEnemy.coordY = randomNumber(displaySettings.top, displaySettings.height - enemyDimension);
        self.currentEnemy.speedX = randomNumber(1, 3);  //поправить!!!!!
        self.currentEnemy.dell = false;
        self.currentEnemy.node = true;
        self.currentEnemy.enemyImg = randomNumber(1, 3);
        self.currentEnemy.angle = 0;
        self.currentEnemy.fr = 0;
        enemyArray.push(self.currentEnemy);
    } 
  
    self.move = function () {
  
      //перебираем массив врагов и случайно, но в одном направлении их двигаем
      for (var i = 0; i < enemyArray.length; i++) {
        enemyArray[i].coordX -= enemyArray[i].speedX;
        if (enemyArray[i].coordX + enemyArray[i].size <= 0) {
            enemyArray[i].dell = true;
        }
  
        // удаяем противника из массива
        if (enemyArray[i].dell) {
            enemyArray.splice(i, 1);
        }
      }
    }
  
    self.draw = function () {
      for (var i = 0; i < enemyArray.length; i++) {
  
        // задаем изображения противника
        switch (enemyArray[i].enemyImg) {
          case 1:
            currentEnemyImg = enemy1Display;
            ctx.save();
            ctx.translate(enemyArray[i].coordX + enemyArray[i].size / 2, enemyArray[i].coordY + enemyArray[i].size / 2);
            ctx.drawImage(currentEnemyImg, enemyArray[i].fr*97, 0, 80, 80, -enemyArray[i].size / 2, -enemyArray[i].size / 2, enemyArray[i].size, enemyArray[i].size);
            ctx.restore();
            if (frameN%(self.currentEnemy.speedX*5)===0){
                enemyArray[i].fr +=1;
            if (enemyArray[i].fr===10) enemyArray[i].fr=0;
            }
            break;
  
          case 2:
            currentEnemyImg = enemy2Display;
            ctx.save();
            ctx.translate(enemyArray[i].coordX + enemyArray[i].size / 2, enemyArray[i].coordY + enemyArray[i].size / 2);
            ctx.drawImage(currentEnemyImg, self.fr*80, 0, 80, 80, -enemyArray[i].size / 2, -enemyArray[i].size / 2, enemyArray[i].size, enemyArray[i].size);
            ctx.restore();
            if (frameN%(self.currentEnemy.speedX*5)===0){
                enemyArray[i].fr +=1;
            if (enemyArray[i].fr===10) enemyArray[i].fr=0;
            }
            break;
  
  
          case 3:
            currentEnemyImg = enemy3Display;
            ctx.save();
            ctx.translate(enemyArray[i].coordX + enemyArray[i].size / 2, enemyArray[i].coordY + enemyArray[i].size / 2);
            ctx.drawImage(currentEnemyImg, self.fr*80, 0, 80, 80, -enemyArray[i].size / 2, -enemyArray[i].size / 2, enemyArray[i].size, enemyArray[i].size);
            ctx.restore();
            if (frameN%(self.currentEnemy.speedX*5)===0){
                enemyArray[i].fr +=1;
            if (enemyArray[i].fr===10) enemyArray[i].fr=0;
            }
            break;
        }
      }
    }
}

  // ОБЪЕКТ ВЫСТРЕЛ

function Bullet() {
    var self = this;
    self.shotspeed = 10;
    self.shotN;
  
    self.newShot = function (x, y) {
  
      //создаём объект выстрела и добавляем его в массив для учёта выстрелов
      self.shotN = {};
      self.shotN.size = shotDimension;
      self.shotN.coordX = x + heroDimension/1.3;
      self.shotN.coordY = y + shotDimension;
      self.shotN.speed = self.shotspeed;
      shotArray.push(self.shotN);
    }

    self.move = function () {
      for (var i = 0; i < shotArray.length; i++) {
        shotArray[i].coordX += shotArray[i].speed;
        if (shotArray[i].coordX >= displaySettings.width) shotArray.splice(i, 1);
      }
    }
  
    self.draw = function () {
      for (var i = 0; i < shotArray.length; i++) {
        // console.log(shotArray[i].coordX);
        ctx.drawImage(bulletDisplay, shotArray[i].coordX, shotArray[i].coordY, shotArray[i].size, shotArray[i].size/4);
      }
    }
}   