"use strict";
var RAF=
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { window.setTimeout(callback, 1000 / 60); };

//ЗВУКИ
// var tankEngine = new Audio("stuff/tankengine.mp3");
// tankEngine.volume = 0.1;

// количество циклов - для генерации случайных событий и появлений объектов
let frameN = 0;

// определяем размеры окна
var userDisplayHeight = document.body.offsetHeight;
var userDisplayWidth = document.body.offsetWidth;
var displaySettings = {
  color: "white",
  height: userDisplayHeight,
  width: userDisplayWidth,
  top: 0,
  left: 0,
};

//инициализируем массивы для учёта врагов, выстрелов
var enemyArray = [];
var shotArray = [];

// инициализация размеров объектов в зависимости от размеров пользовательского экрана
//для удобства все объекты пока - квадратные

var heroDimension = (userDisplayHeight + userDisplayWidth)/2/12;
var enemyDimension = (userDisplayHeight + userDisplayWidth)/2/12;
var shotDimension = (userDisplayHeight + userDisplayWidth)/60;


// СОЗДАЁМ НУЖНЫЕ ОБЪЕКТЫ КЛАССОВ

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


// находим canvas
var canvasArea = document.querySelector(".canv");
canvasArea.setAttribute("height", displaySettings.height);
canvasArea.setAttribute("width", displaySettings.width);
let ctx = canvasArea.getContext('2d');

function runTheGame() {
    // sndStart(tankEngine);
    controller.heroHandler();
    startGame();
}

//запуск игры
function startGame() {
    updateGameState(); //обновление состояния
    drawGame(); //обновление отрисовки
    return RAF(startGame);
  };

  function updateGameState() {

    frameN++;
  
    //сброс таймера
    if (frameN > 1000) frameN = 0;

    //создаём врагов
    if (frameN % 100 === 0) {
      newEnemy.create();
    }
    newShot.move();
    newEnemy.move();
    // двигаем корабль со скоротью 0, при ажатии на клавишу скорость увеличиваем
    hero.moveHero();
  }

  function drawGame() {

    // ПЕРВЫМ ДЕЛОМ закрашиваем весь экран
    ctx.fillStyle = displaySettings.color;
    ctx.fillRect(displaySettings.top, displaySettings.left, displaySettings.width, displaySettings.height);
    
    newShot.draw();
    newEnemy.draw();
    //отображаем героя
    hero.drawHero();
  }
    //запуск звуковых эффектов
  function sndStart(audio) {
    audio.currentTime = 0; // в секундах
    audio.play();
  }

  // случайное число
  function randomNumber(i, j) {
    return Math.floor(Math.random() * (j - i + 1)) + i;
  }

  runTheGame();