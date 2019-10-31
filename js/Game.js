class Game {
	constructor() {
		this.el = $('#game');
		this.canvas = document.querySelector('#canvas');
		this.ctx = this.canvas.getContext('2d');
		this.overlay = $('#overlay');

		this.bg = document.querySelector('#asset-bg');
		let buttons = document.querySelectorAll('#controls > span');
		buttons[0].addEventListener('mouseenter', ev => { this.player.left = true });
		buttons[1].addEventListener('mouseenter', ev => { this.player.right = true });
		buttons[2].addEventListener('mouseenter', ev => { this.player.up = true });
		buttons[3].addEventListener('mouseenter', ev => { this.player.down = true });
		buttons[0].addEventListener('mouseleave', ev => { this.player.left = false });
		buttons[1].addEventListener('mouseleave', ev => { this.player.right = false });
		buttons[2].addEventListener('mouseleave', ev => { this.player.up = false });
		buttons[3].addEventListener('mouseleave', ev => { this.player.down = false });
		let btnPause = document.querySelector('#btn-pause');
		btnPause.addEventListener('click', ev => {
			this.isPaused = !this.isPaused;
			let className = this.isPaused ? 'wf-ion-ios-play' : 'wf-ion-ios-pause';
			btnPause.querySelector('span').className = className;
		});

		let btnMute = document.querySelector('#btn-mute');
		btnMute.addEventListener('click', ev => {
			this.isMuted = !this.isMuted;
			let className = this.isMuted ? 'wf-ion-android-volume-mute' : 'wf-ion-android-volume-up';
			btnMute.querySelector('span').className = className;
			this.muteSounds();
		});

		let btnFontUp = document.querySelector('#btn-font-up');
		let btnFontDown = document.querySelector('#btn-font-down');
		btnFontUp.addEventListener('click', ev => {this.fontSize++;this.resizeFont();});
		btnFontDown.addEventListener('click', ev => {this.fontSize--;this.resizeFont();});

		this.bgm = document.querySelector('#audio-bg');
		this.shootAudio = document.querySelector('#audio-shoot');
		this.destroyedAudio = document.querySelector('#audio-destroy');
		this.audios = [this.bgm, this.shootAudio, this.destroyedAudio];

		let input = document.querySelector('#input-name');
		let btnContinue = document.querySelector('#btn-continue');
		input.addEventListener('keyup', ev => {
			if (input.value != '') {
				btnContinue.removeAttribute('disabled');
			} else {
				btnContinue.setAttribute('disabled', '');
			}
		});

		let form = document.querySelector('#score-submit');
		form.addEventListener('submit', ev => {
			ev.preventDefault();
			let data = new FormData();
			data.append('name', input.value);
			data.append('score', this.score);
			data.append('time', Math.floor(this.timer / 1000));
			fetch('/register.php', {
				method: 'post',
				mode: 'no-cors',
				body: data,
			})
			.then(r => r.json())
			.then(r => {
				window.scores = r;
				engine.changeState(2);
			});
		});
	}

	resizeFont() {
		this.centerBox.css('fontSize', this.fontSize + 'pt');
	}

	muteSounds() {
		for (let a of this.audios) {
			a.volume = this.isMuted ? 0 : 1;
		}
	}

	init() {
		this.bgm.currentTime = 0;
		this.bgm.play();

		this.centerBox = $('#center-box');
		this.el.show();
		this.dead = false;
		this.overlay.hide();
		this.asteroids = [];
		this.fuels = [];
		this.enemies = [];
		this.friends = [];
		this.planets = [];
		this.pbullets = [];
		this.ebullets = [];
		this.timers = [];
		this.particles = [];
		this.hasShot = false;
		this.isPaused = false;
		this.isMuted = false;
		this.oldTime = 0;
		this.fontSize = 12;
		this.fuel = 15;
		this.fuelCounter = $('.bar');
		this.timer = 0;
		this.score = 0;
		this.resizeFont();

		this.bg1 = 0;
		this.bg2 = this.canvas.width;
		this.player = new Player();

		// spawn planets
		this.timers.push(new Timer(3500, () => {
			this.planets.push(new Planet(this.canvas.width, randomBetween(0, this.canvas.height)));
		}));
		// spawn asteroids
		this.timers.push(new Timer(2500, () => {
			this.asteroids.push(new Asteroid(this.canvas.width, randomBetween(0, this.canvas.height)));
		}));
		// spawn fuels
		this.timers.push(new Timer(1500, () => {
			let fuel = new Fuel(randomBetween(0, this.canvas.width), 0);
			fuel.y -= fuel.h;
			this.fuels.push(fuel);
		}));
		// spawn friends
		this.timers.push(new Timer(3200, () => {
			this.friends.push(new Friend(this.canvas.width, randomBetween(0, this.canvas.height)));
		}));
		// spawn enemies
		this.timers.push(new Timer(2400, () => {
			let enemy = new Enemy(this.canvas.width, randomBetween(0, this.canvas.height));
			this.enemies.push(enemy);
			// enemy shoot interval
			let t = new Timer(2300, () => {	
				this.ebullets.push(new Bullet(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, true));
			});
			enemy.timer = t;
			this.timers.push(t);
		}));
	}

	draw(timestamp) {
		let time = timestamp - this.oldTime;
		if (this.oldTime == 0) {
			time = 16;
		}
		this.oldTime = timestamp;

		if (this.isPaused) return;

		this.timer += time;

		// tick timers
		this.timers.forEach((t, i) => {
			t.tick(time);
			if (t.dead) {
				this.timers.splice(i, 1);
			}
		});

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		// draw backgrounds
		this.ctx.drawImage(this.bg, this.bg1, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(this.bg, this.bg2, 0, this.canvas.width, this.canvas.height);
		this.bg1--;
		this.bg2--;
		if (this.bg1 <= -this.canvas.width) this.bg1 = this.canvas.width;
		if (this.bg2 <= -this.canvas.width) this.bg2 = this.canvas.width;

		// draw planets
		this.planets.forEach((p, i) => {
			p.draw(this.ctx, time);
			if (p.x + p.w < 0) {
				this.planets.splice(i, 1);
			}
		});
		// draw asteroids
		this.asteroids.forEach((p, i) => {
			p.draw(this.ctx, time);
			if (p.x + p.w < 0) {
				this.asteroids.splice(i, 1);
			}
			if (isColliding(p, this.player)) {
				this.fuel -= 15;
				this.asteroids.splice(i, 1);
				this.createDestroyEffect(p);
			}
			this.pbullets.forEach((b, j) => {
				if (isColliding(p, b)) {
					p.lives--;
					if (p.lives <= 0) {
						this.asteroids.splice(i, 1);
						this.score += 10;
						this.createDestroyEffect(p);
					}
					this.pbullets.splice(j, 1);
					p.img = p.sprites[p.lives];
				}
			});
		});
		// draw fuels
		this.fuels.forEach((p, i) => {
			p.draw(this.ctx, time);
			if (p.y > this.canvas.height) {
				this.fuels.splice(i, 1);
			}
			if (isColliding(p, this.player)) {
				this.fuels.splice(i, 1);
				this.fuel += 15;
				if (this.fuel > 30) this.fuel = 30;
			}
		});
		// draw friends
		this.friends.forEach((p, i) => {
			p.draw(this.ctx, time);
			if (p.x + p.w < 0) {
				this.friends.splice(i, 1);
			}
			if (isColliding(p, this.player)) {
				this.fuel -= 15;
				this.friends.splice(i, 1);
				this.createDestroyEffect(p);
			}
			this.pbullets.forEach((b, j) => {
				if (isColliding(p, b)) {
					this.friends.splice(i, 1);
					this.pbullets.splice(j, 1);
					this.score -= 10;
					this.createDestroyEffect(p);
				}
			});
		});
		// draw enemies
		this.enemies.forEach((p, i) => {
			p.draw(this.ctx, time);
			if (p.x + p.w < 0) {
				p.timer.dead = true;
				this.enemies.splice(i, 1);
			}
			if (isColliding(p, this.player)) {
				this.fuel -= 15;
				this.enemies.splice(i, 1);
				p.timer.dead = true;
				this.createDestroyEffect(p);
			}
			this.pbullets.forEach((b, j) => {
				if (isColliding(p, b)) {
					p.timer.dead = true;
					this.enemies.splice(i, 1);
					this.pbullets.splice(j, 1);
					this.score += 5;
					this.createDestroyEffect(p);
				}
			});
		});
		// draw player bullets
		this.pbullets.forEach((p, i) => {
			p.draw(this.ctx, time);
			if (p.x > this.canvas.width) {
				this.pbullets.splice(i, 1);
			}
		});
		// draw enemies bullets
		this.ebullets.forEach((p, i) => {
			p.draw(this.ctx, time);
			if (isColliding(p, this.player)) {
				this.ebullets.splice(i, 1);
				this.fuel -= 15;
			}
			if (p.x + p.w < 0) {
				this.ebullets.splice(i, 1);
			}
		});

		this.particles.forEach((p, i) => {
			p.draw(this.ctx, time);
			if (p.atoms.length == 0) this.particles.splice(i, 1);
		});

		// decrease fuel
		this.fuel -= time / 1000;
		let percentage = (this.fuel * 100 / 30);
		$('#fuel-counter').css('width', percentage + '%');
		$('#fuel-text').text(Math.floor(this.fuel));
		$('#time-el').text(Math.floor(this.timer / 1000));
		$('#score-el').text(this.score);

		// draw player
		this.player.draw(this.ctx, time);

		if (this.fuel <= 0 && !this.dead) {
			this.dead = true;
			this.createDestroyEffect(this.player);
			this.player.w = 0;
			this.player.h = 0;
			setTimeout(() => {
				// game over
				this.isPaused = true;
				this.muteSounds();
				this.overlay.show();
			}, 1000);
		}
	}

	createDestroyEffect(obj) {
		this.destroyedAudio.currentTime = 0.1;
		this.destroyedAudio.play();
		this.particles.push(new Particle(obj));
	}

	exit() {
		this.el.hide();
	}

	keyup(ev) {
		if (ev.key == ' ') {
			this.hasShot = false;
		}
		if (ev.key == 'p' || ev.key == 'P') this.isPaused = !this.isPaused;
		if (ev.key == 'a' || ev.key == 'A') this.player.left = false;
		if (ev.key == 's' || ev.key == 'S') this.player.down = false;
		if (ev.key == 'd' || ev.key == 'D') this.player.right = false;
		if (ev.key == 'w' || ev.key == 'W') this.player.up = false;
	}

	keydown(ev) {
		if (ev.key == ' ' && !this.hasShot) {
			this.hasShot = true;
			this.pbullets.push(new Bullet(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, false));
			// play shoot audio
			this.shootAudio.currentTime = 0.1;
			this.shootAudio.play();
		}
		if (ev.key == 'a' || ev.key == 'A') this.player.left = true;
		if (ev.key == 's' || ev.key == 'S') this.player.down = true;
		if (ev.key == 'd' || ev.key == 'D') this.player.right = true;
		if (ev.key == 'w' || ev.key == 'W') this.player.up = true;
	}
}