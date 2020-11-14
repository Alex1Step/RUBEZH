"use strict";

var diamBase = 300; //диаметр диска часов
var diamNum = 30; //диаметр кругов вокруг цифр
var angle = (30 / 180) * Math.PI; //градусов в одном часу
var secNminAngle = 360 / 60; //градусов в одном шаге секундной и минутной стреллки
var hAngle = 360 / 12; // градусов в одном шаге часовой стреллки
var textHight = 20 // высота текста на циферблате

//создаём базу часов
var newCanvas = document.createElement("canvas");
newCanvas.setAttribute("id", "CLEAR");
newCanvas.setAttribute("width", diamBase);
newCanvas.setAttribute("height", diamBase);
document.body.appendChild(newCanvas);
var canvasClock=document.getElementById('CLEAR');
var contextClock=canvasClock.getContext('2d');

//отрисовка и работа часов
function updateTime(){
  contextClock.beginPath();
  contextClock.arc(diamBase/2,diamBase/2,diamBase/2-0.5,0,Math.PI*2,true);
  contextClock.fillStyle='yellow';
  contextClock.fill();
  //создаём цифры на часах
  var numCircle = [];
  var txtCircle = [];
  for (var i = 1; i <= 12; i++) {
    var numCenterX =
      diamBase / 2 + (diamBase / 2 - diamNum) * Math.sin(i * angle);
    var numCenterY =
      diamBase / 2 - (diamBase / 2 - diamNum) * Math.cos(i * angle);
      contextClock.beginPath();
      contextClock.arc(numCenterX,numCenterY,diamNum/2,0,Math.PI*2,true);
      contextClock.fillStyle='green';
      contextClock.fill();
      contextClock.fillStyle='black';
      contextClock.font = `${textHight}px Verdana`;
      contextClock.textAlign = "center";
      contextClock.fillText(i, numCenterX, numCenterY + textHight/3);
  }

  //создаём цифровые часы
  var currTime = new Date();
  var textForDigitalClock =
    str0l(currTime.getHours(), 2) +
    ":" +
    str0l(currTime.getMinutes(), 2) +
    ":" +
    str0l(currTime.getSeconds(), 2);
  contextClock.fillStyle='black';
  contextClock.font = `${textHight}px Verdana`;
  contextClock.textAlign = "center";
  contextClock.fillText(textForDigitalClock, diamBase/2, diamBase/3);
  //секундная стрелка
  var a1 = secNminAngle * currTime.getSeconds()/180*Math.PI;
  contextClock.beginPath();
  contextClock.lineWidth = 2;
  contextClock.moveTo(diamBase/2, diamBase/2);
  contextClock.lineTo(Math.round(diamBase/2 + (diamBase/3)*Math.sin(a1)), Math.round(diamBase/2 - (diamBase/3)*Math.cos(a1)));
  contextClock.stroke();
  //минутная стрелка
  var a2 = secNminAngle * currTime.getMinutes()/180*Math.PI;
  contextClock.beginPath();
  contextClock.lineWidth = 4;
  contextClock.lineCap = "round";
  contextClock.moveTo(diamBase/2, diamBase/2);
  contextClock.lineTo(Math.round(diamBase/2 + (diamBase/3.5)*Math.sin(a2)), Math.round(diamBase/2 - (diamBase/3.5)*Math.cos(a2)));
  contextClock.stroke();
  //часовая стрелка
  var a3 = hAngle * currTime.getHours()/180*Math.PI + hAngle*a2/360;
  console.log(a2);
  contextClock.beginPath();
  contextClock.lineWidth = 8;
  contextClock.lineCap = "round";
  contextClock.moveTo(diamBase/2, diamBase/2);
  contextClock.lineTo(Math.round(diamBase/2 + (diamBase/4)*Math.sin(a3)), Math.round(diamBase/2 - (diamBase/4)*Math.cos(a3)));
  contextClock.stroke();
}

updateTime();

//дополнение нулями
function str0l(val, len) {
  var strVal = val.toString();
  while (strVal.length < len) strVal = "0" + strVal;
  return strVal;
}

setInterval(updateTime, 1000);
