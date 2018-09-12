"use strict";

var ga = ga(320, 240, load, ['dinozarek.png', 'kaktus.png', 'piasek.png']);
var dino;
var cactus;
var glitch;
var glitchColors = [
	'red',
	'crimson',
	'lime',
	'yellow',
	'gold',
	'darkviolet',
	'brown',
	'grey',
];
var endMessages = [
	'',
	'Eating your cookies',
	'Looking at your bookmarks',
	'Spying your browser history',
	'Trying to crack your account password',
	'installing rootkit',
	'Wiping out your hard drive',
	'Data saved. Have a nice day.',
	'Data saved. Have a nice day.',
	'It is now safe to to turn off your computer.',
];
var ground;
var time = 0;
var points = 0;
var pointsLabel;
var endLabel;
var jumpSteps = 0;
var floorY = 240 - 96;
var scrollSpeed = 150;

ga.start();
ga.fps = 60;

function load() {
	ga.backgroundColor = 'lightblue';
	ground = createGround();
	dino = ga.sprite('dinozarek.png');
	cactus = ga.sprite('kaktus.png');
	glitch = ga.rectangle(64, 64, 'red', '', 0, 360, floorY - 32);
	pointsLabel = ga.text('0', '16px serif', 'black', 250, 20);
	dino.x = 8;
	dino.y = floorY;
	genCactus();
	setupPlayerControls();
	ga.state = game;
}

function createGround(nx, ny) {
	var g = ga.group();
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 3; y++) {
			var o = ga.sprite('piasek.png');
			o.x = 32 * x;
			o.y = floorY + 32 * (y + 1);
			g.addChild(o);
		}
	}
	return g;
}

function genCactus() {
	cactus.x = ga.randomInt(320, 350);
	cactus.y = floorY;
}

function jump() {
	if (dino.y == floorY) {
		jumpSteps = 24;
	}
}

function reset() {
	dino.x = 8;
	dino.y = floorY;
	genCactus();
	points = 0;
	scrollSpeed = 150;
	pointsLabel.content = '0';
}

function centeredLabel(content, font, color, y) {
	var label = ga.text(content, font, color, 1, y);
	ga.canvas.ctx.font = font;
	label.x = (ga.stage.width - label.width) * 0.5;
	return label;
}

function end() {
	time = 0;
	ga.state = endGame;
	ga.remove(dino);
	ga.remove(cactus);
	ga.remove(glitch);
	ga.remove(ground);
	ga.remove(pointsLabel);
	ga.text(':(', '64px sans-serif', 'white', 32, 32);
	ga.text('Your dino run into a glitch', '14px sans-serif', 'white', 96, 32);
	ga.text('and needs to restart', '14px sans-serif', 'white', 96, 54);
	ga.text('We\'re just collecting some', '14px sans-serif', 'white', 96, 76);
	ga.text('offline data and then we\'ll', '14px sans-serif', 'white', 96, 98);
	ga.text('restart for you', '14px sans-serif', 'white', 96, 120);
	//
	endLabel = centeredLabel('', '14px sans-serif', 'white', 160);
	centeredLabel('To know more search online', '14px sans-serif', 'white', 190);
	centeredLabel('for code 0FF11N3', '14px sans-serif', 'white', 212);
}

function score() {
	points++;
	pointsLabel.content = points;
	dino.x += 12;
	scrollSpeed += 8;
}

function setupPlayerControls() {
	ga.key.upArrow.press = function() {
		jump();
	};
	ga.key.space.press = function() {
		jump();
	};
}

function game() {
	if (jumpSteps > 0) {
		jumpSteps--;
		dino.y -= 4;
	} else {
		dino.y = Math.min(floorY, dino.y + 4);
	}
	if (points < 13) {
		cactus.x -= scrollSpeed / ga.fps;
		if (cactus.x < -30) {
			score();
			genCactus();
		}
		if (ga.hitTestRectangle(dino, cactus, false)) {
			reset();
		}
	} else {
		glitch.x -= 50 / ga.fps;
		glitch.fillStyle = glitchColors[ga.randomInt(0, glitchColors.length - 1)];
		if (ga.hitTestRectangle(dino, glitch, false)) {
			end();
		}
	}
}

function endGame() {
	time += 1 / ga.fps;
	var i = Math.min(endMessages.length - 1, Math.floor(time / 3.5));
	endLabel.content = endMessages[i];
	ga.canvas.ctx.font = endLabel.font;
	endLabel.x = (ga.stage.width - endLabel.width) * 0.5;
}
