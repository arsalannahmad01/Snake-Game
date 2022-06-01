let canvas;
let ctx;
let targetBlockPos;
let gBArrayWidth = 71;
let gBArrayHeight = 56;
let score = 0;
let winOrLose = "Playing";
let playOrPause = true;
let snakeLogo;
let Sound;
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

const canvaSizeX = 1550;
const canvaSizeY = 896;

let DIRECTION = {
    LEFT: 0,
    DOWN: 1,
    UP: 2,
    RIGHT: 3
}

let direction = DIRECTION.RIGHT;

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function CreateCoordArray() {
    let i = 0, j = 0;
    for (let y = 0; y <= 448; y += 9) {
        for (let x = 0; x <= 896; x += 9) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

var snake = {
    speed: 100,
    length: 4,
    defaultPosition: {
        x: 200,
        y: 200
    },
    buildingBlocks: [],
}

let snakeHeadPos = [snake.defaultPosition.x, snake.defaultPosition.y];

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {
    canvas = document.getElementById("my-canvas");
    ctx = canvas.getContext('2d');
    canvas.width = 1550;
    canvas.height = 896;


    ctx.scale(2, 2);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, 570, 448);

    snakeLogo = new Image(161, 54);
    snakeLogo.onload = DrawsnakeLogo;
    snakeLogo.src = "snake-text.png";

    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 600, 140, 200, 50);

    ctx.strokeRect(600, 150, 150, 30);

    ctx.font = '18px Arial';
    ctx.fillText(score.toString(), 615, 171);

    // ctx.fillStyle = 'black';
    // ctx.font = '21px Arial';
    // ctx.fillText("STATUS", 600, 220, 200, 50);

    // ctx.strokeRect(600, 230, 150, 30);

    // ctx.font = '17px Arial';
    // ctx.fillText(winOrLose.toString(), 615, 250);
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("STATUS", 600, 220, 200, 50);

    ctx.strokeRect(600, 230, 150, 30);
    PlayOrPause(winOrLose);

    Sound = document.getElementById('sound');
    Sound.src = 'sound.wav';


    document.addEventListener('keydown', HandleKeyPress);
    createSnake();
    DrawSnake();
    targetBlockPos = createRandomBlock();
    // console.log(targetBlockPos);
    // moveSnakeLeft();
}

function PlayOrPause(status) {

    ctx.fillStyle = 'white';
    ctx.fillRect(602, 234, 140, 25);
    ctx.fillStyle = 'black';
    ctx.font = '17px Arial';
    ctx.fillText(status, 615, 250);
}

function DrawsnakeLogo() {
    ctx.drawImage(snakeLogo, 590, 10, 170, 70);
}

function eraseSnakeBlock([x, y]) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, 8, 8);
}

function drawSnakeBlocks([x, y]) {
    ctx.fillStyle = 'brown';
    ctx.fillRect(x, y, 8, 8);
}

function createSnake() {
    let snakeX = snake.defaultPosition.x;
    let snakeY = snake.defaultPosition.y;
    for (let i = 0; i < snake.length; i++) {
        snake.buildingBlocks.push([snakeX, snakeY]);
        snakeX += 9;
    }
}

function DrawSnake() {
    for (let i = 0; i < snake.length; i++) {
        drawSnakeBlocks(snake.buildingBlocks[i]);
    }
}

// let prvDirection = direction;
function moveSnake() {

    let lastBlockPos = snake.buildingBlocks.pop();
    let newBlockPos;
    if (direction === DIRECTION.RIGHT) {
        newBlockPos = [(snake.buildingBlocks[0][0] + 9 + 554) % 554, snake.buildingBlocks[0][1]];
        snakeHeadPos = [(snake.buildingBlocks[0][0] + 9 + 554) % 554, snake.buildingBlocks[0][1]];
    } else if (direction === DIRECTION.LEFT) {
        newBlockPos = [(snake.buildingBlocks[0][0] - 9 + 554) % 554, snake.buildingBlocks[0][1]];
        snakeHeadPos = [(snake.buildingBlocks[0][0] - 9 + 554) % 554, snake.buildingBlocks[0][1]];
    } else if (direction === DIRECTION.UP) {
        newBlockPos = [snake.buildingBlocks[0][0], (snake.buildingBlocks[0][1] - 9 + 440) % 440];
        snakeHeadPos = [snake.buildingBlocks[0][0], (snake.buildingBlocks[0][1] - 9 + 440) % 440];
    } else if (direction === DIRECTION.DOWN) {
        newBlockPos = [snake.buildingBlocks[0][0], (snake.buildingBlocks[0][1] + 9 + 440) % 440];
        snakeHeadPos = [snake.buildingBlocks[0][0], (snake.buildingBlocks[0][1] + 9 + 440) % 440];
    }
    snake.buildingBlocks.unshift(newBlockPos);
    eraseSnakeBlock(lastBlockPos);
    drawSnakeBlocks(newBlockPos);
    CheckIfSnakeMetTarget();
    snakeHeadPos[0] += 9;
    snakeHeadPos[1] += 9;
}

function HandleKeyPress(key) {

    if (winOrLose != "Game Over") {

        if (playOrPause === true && key.keyCode === 32) {
            playOrPause = false;
            PlayOrPause("Pause");
        } else if (playOrPause === false && key.keyCode === 32) {
            playOrPause = true;
            PlayOrPause("Playing");
        }

        if ((direction != DIRECTION.RIGHT) && (key.keyCode === 37)) {
            direction = DIRECTION.LEFT;
        } else if ((direction != DIRECTION.DOWN) && (key.keyCode === 38)) {
            direction = DIRECTION.UP;
        } else if ((direction != DIRECTION.LEFT) && (key.keyCode === 39)) {
            direction = DIRECTION.RIGHT;
        } else if ((direction != DIRECTION.UP) && (key.keyCode === 40)) {
            direction = DIRECTION.DOWN;
        }
    }
}


window.setInterval(function () {
    if (playOrPause && winOrLose != "Game Over") {
        snakeHeadPos[0] += 9;
        snakeHeadPos[1] += 9;
        moveSnake();
    }
}, snake.speed);

function createRandomBlock() {
    let posX = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    let posY = Math.floor(Math.random() * (438 - 10 + 1)) + 10;
    drawSnakeBlocks([posX, posY]);
    return [posX, posY];
}

function CheckIfSnakeMetTarget() {

    if (((snakeHeadPos[1] + 7 >= targetBlockPos[1]) && (snakeHeadPos[1] <= targetBlockPos[1] + 7) && (snakeHeadPos[0] >= targetBlockPos[0]) && (snakeHeadPos[0] <= targetBlockPos[0] + 7)) ||
        ((snakeHeadPos[0] + 7 >= targetBlockPos[0]) && (snakeHeadPos[0] <= targetBlockPos[0] + 7) && (snakeHeadPos[1] >= targetBlockPos[1]) && (snakeHeadPos[1] <= targetBlockPos[1] + 7))) {
        Sound.play();
        eraseSnakeBlock(targetBlockPos);
        snake.buildingBlocks.unshift([snakeHeadPos[0], snakeHeadPos[1]]);
        drawSnakeBlocks([snakeHeadPos[0], snakeHeadPos[1]]);
        snake.length += 1;
        targetBlockPos = createRandomBlock();
        ShowScore();
    }
}

function ShowScore() {
    score += 4;
    ctx.fillStyle = 'white';
    ctx.fillRect(610, 152, 100, 20);
    ctx.fillStyle = 'black';
    ctx.fillText(score.toString(), 615, 171);
}
