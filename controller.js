"use strict"

function Controller() {
    var self = this;
    self.speedH = 4;
    self.moveUp = 87;
    self.moveDown = 83;
    self.moveLeft = 65;
    self.moveRight = 68;
    self.shot = 32;
    self.stopWavePlease = 13;
    self.waveStopperWasUsed = false;

    //вешаем обработчики события
    self.heroHandler = function () {
        document.addEventListener("keydown", self.heroMove, false);
        document.addEventListener("keyup", self.heroStopMove, false);  
    }

    //обработчик нажатия клавиш управления с клавиатуры
    self.heroMove = function (EO) {
        var EO = EO || window.event;
        EO.preventDefault();
        switch (EO.keyCode) {
          case self.moveUp:
            hero.speedY = -self.speedH;
            break;
          case self.moveDown:
            hero.speedY = self.speedH;
            break;
          case self.moveLeft:
            hero.speedX = -self.speedH;
            break;
          case self.moveRight:
            hero.speedX = self.speedH;
            break;
          case self.shot:
            newShot.newShot(hero.posX, hero.posY);
            break;
          case self.stopWavePlease:
            if (self.waveStopperWasUsed===false) {
              stopTheWave = true;
              setInterval(()=>{stopTheWave=false;}, 10000);
              self.waveStopperWasUsed=true;
            }
            break;
        }
    }

    //обработчик отпускания клавиш управления с клавиатуры
    self.heroStopMove = function (EO) {
        if (EO.keyCode === self.moveRight || EO.keyCode === self.moveLeft) {
        hero.speedX = 0;
        }
        if (EO.keyCode === self.moveDown || EO.keyCode === self.moveUp) {
        hero.speedY = 0;
        }
    }
}