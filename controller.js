"use strict"

function Controller() {
    var self = this;
    self.speedH = 3;
    self.moveUp = 87;
    self.moveDown = 83;
    self.moveLeft = 65;
    self.moveRight = 68;
    self.shot = 32;
    self.stopWavePlease = 13;
    self.waveStopperWasUsed = false;

    self.draggy = false;
    self.timeSTAMPshot;
    //вешаем обработчики события
    self.heroHandler = function () {
        document.addEventListener("keydown", self.heroMove, false);
        document.addEventListener("keyup", self.heroStopMove, false);
        document.querySelector(".game").addEventListener("touchstart", self.shotT, false);
        document.querySelector(".game").addEventListener("touchmove", self.moveT, false);
        document.querySelector(".game").addEventListener("touchend", self.clearT, false);
        // ЖЕСТ обрабатывается при помощи библиотеки Zepto
        $('.game').bind("swipeRight", function () {
          if (self.waveStopperWasUsed===false) {
            stopTheWave = true;
            setInterval(()=>{stopTheWave=false;}, 10000);
            self.waveStopperWasUsed=true;
          }
        })
    }

    //обработчик нажатия клавиш управления с клавиатуры
    self.heroMove = function (EO) {
        var EO = EO || window.event;
        // EO.preventDefault();
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

    //touch события

    //касание
    self.shotT = function (EO) {
      EO = EO || window.event;
      EO.preventDefault();
      self.timeSTAMPshot = EO.timeStamp;
      newShot.newShot(hero.posX, hero.posY);
    }
    //перетаскивание героя
    self.moveT = function (EO) {
      EO = EO || window.event;
      EO.preventDefault();
      hero.posX = EO.targetTouches[0].pageX-heroDimension/2;
      hero.posY = EO.targetTouches[0].pageY-heroDimension/2;
    }
    //касание снято
    self.clearT = function (EO) {
      EO = EO || window.event;
      EO.preventDefault();
    }
    //изменение размера браузера
    self.resizeBrowser = function () {
      //обновляем все размеры для рисовки и отслеживания в том числе и у уже существующих объектов
      userDisplayHeight = document.body.offsetHeight;
      userDisplayWidth = document.body.offsetWidth;
  
      heroDimension = (userDisplayHeight + userDisplayWidth)/2/12;
      enemyDimension = (userDisplayHeight + userDisplayWidth)/2/12;
      shotDimension = (userDisplayHeight + userDisplayWidth)/60;
  
      for (var n = 0; n < enemyArray.length; n++) {
        enemyArray[n].size = enemyDimension;
      }
      for (var m = 0; m < shotArray.length; m++) {
        shotArray[m].size = shotDimension;
      }
  
      displaySettings.height = userDisplayHeight;
      displaySettings.width = userDisplayWidth;
      
      //и в итоге меняем размер полотна канваса
      canvasArea.setAttribute("height", displaySettings.height);
      canvasArea.setAttribute("width", displaySettings.width);  
    }
    //SPA
    self.switchToStateFromURLHash = function (EO) {
      var URLHash=window.location.hash;
      var stateStr=URLHash.substr(1);

      if ( stateStr!="" ) {
        SPAState={ pagename: stateStr };
      }
      else
        SPAState={pagename:'startpage'};

      // обновляем часть страницы под текущее состояние
      switch ( SPAState.pagename ) {
        case 'startpage':
          if (isPlay===true) {
            if (confirm("В случае перезагрузки страницы прогресс игры будет утрачен!")) {
              isPlay = false;
              startPage();
            }
            else location.hash = 'game';
          }
          else startPage();
          break;
        case 'game':
          runTheGame();
          break;
      }
    }
}