"use strict"

// ОБЪЕКТ ГЕРОЙ

function Hero() {
    var self = this;
    //размещаем героя
    self.posX = heroDimension/4;
    self.posY = displaySettings.height/2 - heroDimension/2;
    self.hFR = 0;
    //скорость пока нулевая, при нажатии клавиш будет меняться
    self.speedX = 0;
    self.speedY = 0;
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

        // столкновение с противником убивает его и отнимает одну жизнь
        //проверяем каждого врага из массива на пересечение координат героя
        for (var n = 0; n < enemyArray.length; n++) {
          if (Math.abs(enemyArray[n].coordY - self.posY) <= enemyArray[n].size &&
           Math.abs(enemyArray[n].coordX - self.posX) <= enemyArray[n].size) {
            // clickSound(crashSound);

            // // добавляем взрыв в массив
            // boom.push({ x: aster[i].posX, y: aster[i].posY, animX: boomSpeed, animY: boomSpeed });

            // уничтожаем врага
            enemyArray[n].crash = true;
            // отслеживаем взрыв
            explosion.push({ x: enemyArray[n].coordX-enemyArray[n].size/2, y: enemyArray[n].coordY-enemyArray[n].size/2, existenceTime: 60, frN: 0 });
            //звук взрыва
            sndStart(explosionSnd);
            vibro();
            //количество здоровья уменьшается
            userHealth--;
            }
          }
        //если здоровье 0 - проигрыш
        if (userHealth===0) theEnd();
      }

    //метод для отрисовки героя
    self.drawHero = function () {
        // рисуем корабль
        ctx.drawImage(heroDisplay, self.hFR*128, 0, 128, 64, self.posX, self.posY, heroDimension*1.3, heroDimension);
        if (frameN%15===0){
          self.hFR+=1;
          if (self.hFR===4) self.hFR=0;
        }
        // рисуем информацию о количестве жизней и количестве очков
        ctx.font = "20px Verdana";
        ctx.textAlign = "left";
        ctx.fillStyle = "green";
        ctx.fillText("Счёт: " + Math.round(userPoints), 20, 50);
        ctx.fillStyle = "blue";
        for (var n=0; n<=userHealth; n++) {
          userHealthUTFstring += "\u25AE ";
        }
        ctx.fillText("Здоровье: " + userHealthUTFstring, 20, 90);
        userHealthUTFstring = "";
    }
}

// ОБЪЕКТ ВРАГ

function Enemy() {
    var self = this;
    self.currentEnemy;
    var currentEnemyImg;
  
    self.create = function () {
        //создаём объект врага и добавляем его в массив для учёта врагов
        self.currentEnemy = {};
        self.currentEnemy.size = enemyDimension;
        self.currentEnemy.coordX = displaySettings.width-enemyDimension;
        self.currentEnemy.coordY = randomNumber(displaySettings.top, displaySettings.height - enemyDimension);
        self.currentEnemy.speedX = randomNumber(1, 3);
        self.currentEnemy.crash = false;
        self.currentEnemy.node = true;
        self.currentEnemy.enemyImg = randomNumber(1, 3);
        self.currentEnemy.angle = 0;
        self.currentEnemy.fr = 0;
        //задаём здоровье каждому виду врагов в зависимости от выбора уровня сложности
        switch (self.currentEnemy.enemyImg) {
          case 1:{
            switch (level) {
              case "1":{
                self.currentEnemy.health = 1;
                break;
              }
              case "2":{
                self.currentEnemy.health = 2;
                break;
              }
              case "3":{
                self.currentEnemy.health = 3;
                break;
              }
            }
        break;
          }
          case 2:{
            switch (level) {
              case "1":{
                self.currentEnemy.health = 1;
                break;
              }
              case "2":{
                self.currentEnemy.health = 3;
                break;
              }
              case "3":{
                self.currentEnemy.health = 4;
                break;
              }
            }
        break;
          }
          case 3:{
            switch (level) {
              case "1":{
                self.currentEnemy.health = 1;
                break;
              }
              case "2":{
                self.currentEnemy.health = 1;
                break;
              }
              case "3":{
                self.currentEnemy.health = 2;
                break;
              }
            }
      break;
          }
        }
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
        if (enemyArray[i].crash) {
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
            ctx.drawImage(currentEnemyImg, enemyArray[i].fr*80, 0, 64, 64, -enemyArray[i].size / 2, -enemyArray[i].size / 2, enemyArray[i].size, enemyArray[i].size);
            ctx.restore();
            if (frameN%(self.currentEnemy.speedX*5)===0){
                enemyArray[i].fr +=1;
            if (enemyArray[i].fr===7) enemyArray[i].fr=0;
            }
            break;
  
          case 3:
            currentEnemyImg = enemy3Display;
            ctx.save();
            ctx.translate(enemyArray[i].coordX + enemyArray[i].size / 2, enemyArray[i].coordY + enemyArray[i].size / 2);
            ctx.drawImage(currentEnemyImg, enemyArray[i].fr*80, 0, 80, 80, -enemyArray[i].size / 2, -enemyArray[i].size / 2, enemyArray[i].size, enemyArray[i].size);
            ctx.restore();
            if (frameN%(self.currentEnemy.speedX*10)===0){
                enemyArray[i].fr +=1;
            if (enemyArray[i].fr===3) enemyArray[i].fr=0;
            }
            break;
        }
        //проигрыш при пересечении врагом линии защиты
        if (enemyArray[i].coordX+enemyArray[i].size <= 0) {
          theEnd();
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
      sndStart(shotSnd);
    }
    //движение пули
    self.move = function () {
      for (var i = 0; i < shotArray.length; i++) {
        shotArray[i].coordX += shotArray[i].speed;
        if (shotArray[i].coordX >= displaySettings.width) shotArray.splice(i, 1);
      }
      //тут же проверка на попадание пули во врага
      //проверяем каждый элемент массива врагов на пересечение координат с каждым элементом массива выстрелов
      for (var n = 0; n < enemyArray.length; n++) {
        for (var m = 0; m < shotArray.length; m++) {
          if (shotArray[m].coordX + shotArray[m].size >= enemyArray[n].coordX &&
            shotArray[m].coordY > enemyArray[n].coordY &&
            shotArray[m].coordY < enemyArray[n].coordY + enemyArray[n].size) {
            // удаляем снаряд из массива отслеживания
            shotArray.splice(m, 1);
            //минусуем health у врага
            enemyArray[n].health -=1;
            //проверяем закончились ли health у данного врага
            if (enemyArray[n].health===0) {
              // отслеживаем взрыв
              explosion.push({ x: enemyArray[n].coordX-enemyArray[n].size/2, y: enemyArray[n].coordY-enemyArray[n].size/2, existenceTime: 60, frN: 0 });
              sndStart(explosionSnd);
              vibro();
              // ставим в объекте этого врага флаг о уничтожении
              enemyArray[n].crash = true;
              //добавляем игроку очков
              userPoints +=1;    
            }        
          }
        }
      }
    }
    //отрисовка
    self.draw = function () {
      for (var i = 0; i < shotArray.length; i++) {
        ctx.drawImage(bulletDisplay, shotArray[i].coordX, shotArray[i].coordY, shotArray[i].size, shotArray[i].size/4);
      }
    }

} 

//взрывы
function explosionView() {
  for (var n = 0; n < explosion.length; n++) {
    if (explosion[n].existenceTime === 0) {
      explosion.splice(n, 1);
    }
    else {
      if (frameN%7===0) {
        ctx.drawImage(expl, explosion[n].frN*400, 0, 400, 400, explosion[n].x, explosion[n].y, enemyDimension*2, enemyDimension*2);
        explosion[n].frN+=1;
        explosion[n].existenceTime -= 1;
      }
    }
  }
}