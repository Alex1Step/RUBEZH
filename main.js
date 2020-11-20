"use strict";
var RAF=
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { window.setTimeout(callback, 1000 / 60); };

var startAnimation;
//переменная для определения была ли использована "помощь"
var stopTheWave = false;
//ЗВУКИ
var tankEngine = new Audio("stuff/tankengine.mp3");
tankEngine.volume = 0.5;
var shotSnd = new Audio("stuff/shot.mp3");
shotSnd.volume = 1;
var explosionSnd = new Audio("stuff/explosionSnd.mp3");
explosionSnd.volume = 0.9;
var backgSnd = new Audio("stuff/backgroundAudio.mp3");
backgSnd.volume = 0.4;

// счётчик - для генерации случайных событий и появлений объектов
var frameN = 0;
//хранение очков
var userPoints = 0;
//количество здоровья
var userHealth = 6;
var userHealthUTFstring = "";
//уровень игры: лёгкий / средний / тяжелый   -   выставляет начальное количество жизней у врагов
var level;  //сюда передать выбор игрока!!!
var levelstr;
//это для увеличения количества врагов в секунду через каждый интервал количества очков
var startN = 120;
var flag1 = 0;
//в игре ли мы?
var isPlay = false;
//для AJAX
var tempNick;
var newScoresTable;

// определяем размеры окна
var userDisplayHeight = document.documentElement.clientHeight;
var userDisplayWidth = document.documentElement.clientWidth;
var displaySettings = {
  color: "white",
  height: userDisplayHeight,
  width: userDisplayWidth,
  top: 0,
  left: 0,
};

//инициализируем массивы для учёта врагов, выстрелов, взрывов
var enemyArray = [];
var shotArray = [];
var explosion = [];

// инициализация размеров объектов в зависимости от размеров пользовательского экрана

var heroDimension = (userDisplayHeight + userDisplayWidth)/2/12;
var enemyDimension = (userDisplayHeight + userDisplayWidth)/2/12;
var shotDimension = (userDisplayHeight + userDisplayWidth)/60;


// СОЗДАЁМ НУЖНЫЕ ОБЪЕКТЫ КЛАССОВ
//это спрайт взрыва
var expl = new Image();
expl.src = "stuff/explosion.png";
//это бэкграунд игры
var backGround = new Image();
backGround.src = "stuff/bg.png";
// этот класс и изображение - герой
var heroDisplay = new Image();
heroDisplay.src = "stuff/hero.png";
var hero = new Hero();
// этот класс и эти изображения - враги
var enemy1Display = new Image();
enemy1Display.src = "stuff/enemy1.png"
var enemy2Display = new Image();
enemy2Display.src = "stuff/enemy2.png"
var enemy3Display = new Image();
enemy3Display.src = "stuff/enemy3.png"
var newEnemy = new Enemy();
// этот класс и изображение - снаряд
var bulletDisplay = new Image();
bulletDisplay.src = "stuff/bullet.png"
var newShot = new Bullet();
//класс для управления объектами
var controller = new Controller();

//НАЧАЛО!!! ВХОД НА САЙТ
window.onload = enterToSite;

function enterToSite() {
  document.body.style.overflow = "hidden";
  location.hash = "startpage";
  var briefDiv = document.querySelector(".brief");
  briefDiv.style.left = -1*userDisplayWidth + "px";
  var tableDiv = document.querySelector(".tableDiv");
  tableDiv.style.left = -1*userDisplayWidth + "px";
}

// событие изменения хэша
window.onhashchange = controller.switchToStateFromURLHash;
// текущее состояние приложения
var SPAState={};

// при перезагрузке или переходе по другому адресу пользователю будет показано предупреждение
window.onbeforeunload = function(EO) {
  if (isPlay===true) {
    var dialogText = 'Прогресс будет потерян!!!';
    EO.returnValue = dialogText;
  }
};
//ХЭШ начальной страницы
function startPage() {
  location.hash = "startpage";
  document.querySelector(".mainpage").style.display = "flex";
  document.querySelector(".game").style.display = "none";
  document.querySelector(".aftergame").style.display = "none";  
  document.querySelector("#userScores").style.display = "block";
  document.querySelector("#nickName").style.display = "block";
  document.querySelector("#nickName").value = "";
  document.querySelector("#nickNameBtn").style.display = "block";
  //здесь останавливаем всё для корректной работы после нажатия "назад" в самой игре
  if (startAnimation) {
    cancelAnimationFrame(startAnimation);
    document.removeEventListener("keydown", self.heroMove, false);
    document.removeEventListener("keyup", self.heroStopMove, false);
  }
  tankEngine.pause();
  backgSnd.pause();
  // устанавливаем начальное положение
  frameN = 0;
  userPoints = 0;
  userHealth = 6;
  userHealthUTFstring = "";
  startN = 120;
  flag1 = 0;
  isPlay = false;
  enemyArray.length = 0;
  shotArray.length = 0;
  explosion.length = 0;
  hero.posX = heroDimension/4;
  hero.posY = displaySettings.height/2 - heroDimension/2;
}

// находим canvas
var canvasArea = document.querySelector(".canv");
canvasArea.setAttribute("height", displaySettings.height);
canvasArea.setAttribute("width", displaySettings.width);
var ctx = canvasArea.getContext('2d');
//запускаем саму игру
function runTheGame() {
  //определяем уровень сложности
    level = String (document.querySelector("#slct").value);
    switch (level) {
      case "1":
        levelstr = "Новичёк";
        break;
      case "2":
        levelstr = "Солдат";
        break;
      case "3":
        levelstr = "Коммандир";
        break;

    }
    //игра началась
    isPlay = true;
    location.hash = "game";
    document.querySelector(".mainpage").style.display = "none";
    document.querySelector(".aftergame").style.display = "none";
    document.querySelector(".game").style.display = "block";
    document.body.style.overflow = "hidden";
    controller.heroHandler();
    sndStart(tankEngine, true);
    sndStart(backgSnd, true);
    startGame();
}

//запуск игры
function startGame() {
    startAnimation = RAF(startGame);
    updateGameState(); //обновление состояния
    drawGame(); //обновление отрисовки
  };

  function updateGameState() {
    frameN++;
    //сброс счётчика
    if (frameN > 1000) frameN = 0;
    
    //создаём врагов 
    if (stopTheWave===false) {
      if (frameN % startN === 0) {
        newEnemy.create();
      }
    }
    //постепенное увеличение количества появляющихся врагов в секунду в зависимости от набранных очков
    if (userPoints ===20 && flag1===0) {
      startN+=-30;
      flag1 += 1;
    }
    if (userPoints === 50 && flag1===1) {
      startN+=-20;
      flag1 += 1;
    }
    if (userPoints === 70 && flag1===2) {
      startN+=-30;
      flag1 += 1;
    }
    if (userPoints === 85 && flag1===3) {
      startN+=-10;
      flag1 += 1;
    }
    if (userPoints === 100 && flag1===4) {
      startN = startN - 10 + 1;
      flag1 += 1;
    }
    newShot.move();
    newEnemy.move();
    // двигаем корабль со скоротью 0, при ажатии на клавишу скорость увеличиваем
    hero.moveHero();
  }
  //отрисовка игры
  function drawGame() {

    // ПЕРВЫМ ДЕЛОМ закрашиваем весь экран в фон и рисуем линию "фронта"
    ctx.drawImage(backGround, 0, 0, displaySettings.width, displaySettings.height, 0, 0, displaySettings.width, displaySettings.height);
    ctx.fillStyle = "red";
    ctx.fillRect(displaySettings.top, displaySettings.left, displaySettings.width/300, displaySettings.height);
    explosionView();
    newShot.draw();
    newEnemy.draw();
    //отображаем героя
    hero.drawHero();
  }
  //конец игры
  function theEnd() {
    document.querySelector("#userScores").innerHTML = `Количество очков: ${userPoints}`;
    document.querySelector(".mainpage").style.display = "none";
    document.querySelector(".game").style.display = "none";
    document.querySelector(".aftergame").style.display = "flex";
    cancelAnimationFrame(startAnimation);
    isPlay = false;
    tankEngine.pause();
    backgSnd.pause();
    //на всякий случай снимаем за собой обработчики событий самой игры
    document.removeEventListener("keydown", self.heroMove, false);
    document.removeEventListener("keyup", self.heroStopMove, false); 
    document.querySelector(".game").removeEventListener("touchstart", self.shotT, false);
    document.querySelector(".game").removeEventListener("touchend", self.clearT, false);
  }

  //функция для запуска звуковых эффектов
  function sndStart(audio, isloop=false) {
    audio.currentTime = 0; // в секундах
    if (isloop===true){
      audio.loop = true;
    }
    audio.play();
  }
  //вибрация на мобильном
  function vibro() {
    if ( navigator.vibrate ) { // есть поддержка Vibration API?
      window.navigator.vibrate(200); // вибрация 100мс
    }
  }

  // генератор случайных чисел
  function randomNumber(i, j) {
    return Math.floor(Math.random() * (j - i + 1)) + i;
  }
  //показать инструктаж
  function showBrief() {
    var briefDiv = document.querySelector(".brief");
    briefDiv.style.visibility = "visible";
    document.querySelector(".brief").style.left = "50%";
    document.querySelector(".brief").style.transform = "translateZ(0) translateX(-50%)";
  }
  //скрыть инструктаж
  function hideBrief() {
    var briefDiv = document.querySelector(".brief");
    briefDiv.style.left = -1*userDisplayWidth + "px";
    briefDiv.style.visibility = "hidden";
  }
  //показать таблицу рекордов
  function showTableDiv() {
    restoreInfo();
  }
  //скрыть таблицу рекордов
  function hideTableDiv() {
    var tableDiv = document.querySelector(".tableDiv");
    tableDiv.style.left = -1*userDisplayWidth + "px";
    tableDiv.style.visibility = "hidden";
  }
  // отслеживаем размеры браузера
  window.addEventListener("resize", controller.resizeBrowser, false);

  //сохранение результата при помощи ajax
  function saveAJAX() {
    tempNick = document.querySelector("#nickName").value;
    storeInfo();
  }
  
  //запись и чтение результата с помощью AJAX на/с сервера //переделать из домашней работы
  var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
  var updatePassword;
  var stringName='STEPANCHUK_RUBEZH_USERSCORES';

    function storeInfo(){
      console.log(document.querySelector("#nickName").value);
      if (document.querySelector("#nickName").value!="") {
        document.querySelector("#userScores").style.display = "none";
        document.querySelector("#nickName").style.display = "none";
        document.querySelector("#nickNameBtn").style.display = "none";
        updatePassword=Math.random();
        $.ajax( {
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'LOCKGET', n : stringName, p : updatePassword },
                success : lockGetReady, error : errorHandler
            }
        );
      }
      else {
        document.querySelector("#nickName").style.border="2px solid red";
        document.querySelector("#nickName").focus();
      }
    }

    function lockGetReady(callresult) {
        if ( callresult.error!=undefined ){
            alert(callresult.error);
        }
        else {
            newScoresTable = JSON.parse(callresult.result);
            newScoresTable[tempNick] = [userPoints, levelstr];
            $.ajax( {
                    url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                    data : { f : 'UPDATE', n : stringName, v : JSON.stringify(newScoresTable), p : updatePassword },
                    success : updateReady, error : errorHandler
                }
            );
        }
    }

    function updateReady(callresult) {
        if ( callresult.error!=undefined )
            alert(callresult.error);
    }

    function restoreInfo() {
      $.ajax(
          {
              url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
              data : { f : 'READ', n : stringName },
              success : readReady, error : errorHandler
          }
      );
  }

  function readReady(callresult) {
      if ( callresult.error!=undefined )
          alert(callresult.error);
      else if ( callresult.result!="" ) {
          var info=JSON.parse(callresult.result);
          var arrayForSort = [];
          var i = 0;
          for (var key in info) {
            arrayForSort[i] = [key, info[key][0], info[key][1]];
            i++;
          }
          arrayForSort.sort(function(a, b) {return a[1] - b[1];});
          createscoreTable(document.querySelector("#scoresArea"), arrayForSort);
          var tableDiv = document.querySelector(".tableDiv");
          tableDiv.style.visibility = "visible";
          document.querySelector(".tableDiv").style.left = "50%";
          document.querySelector(".tableDiv").style.transform = "translateZ(0) translateX(-50%)";
      }
  }

    function errorHandler(jqXHR,statusStr,errorStr) {
        alert(statusStr+' '+errorStr);
    }
    //программное создание таблицы рекордов после чтения с сервера таблицы результатов
    function createscoreTable(field,arr){
      var pageHTML = ''; 
      pageHTML += '<table border=1><tbody>'; 
      pageHTML += '<td>' + 'Место' + '</td>' + '<td>' + 'Nickname' + '</td>' + '<td>' + 'Очки' + '</td>' + '<td>' + 'Уровень' + '</td>'; 
      for(var i = 0; i < 12; i++){ 
        pageHTML += '<tr>'; 
        pageHTML += '<td>' + (i+1) + '</td>' + '<td>' + arr[(arr.length-1)-i][0] + '</td>' + '<td>' + arr[(arr.length-1)-i][1] + '</td>' + '<td>' + arr[(arr.length-1)-i][2] + '</td>'; 
        pageHTML += '</tr>'; 
      } 
      pageHTML += '</tbody></table>'; 
      field.innerHTML = pageHTML; 
    } 