class Particle {
	constructor(obj) {
		this.atomCount = randomBetween(30, 50);
		this.atoms = [];

		for (let i = 0; i < this.atomCount; i++) {
			this.atoms.push(new Atom(obj.x + obj.w / 2, obj.y + obj.h / 2));
		}
		this.duration = 0;
	}

	draw(ctx, time) {
		this.duration += time;
		this.atoms.forEach((atom, i) => {
			if (this.duration > 600 && Math.random() < 0.05) {
				this.atoms.splice(i, 1);
			}
			atom.draw(ctx, this.duration);
		});
	}
}

class Atom {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speed = randomBetween(10, 40) / 10;
		let angle = randomBetween(0, 360);
		this.vx = Math.sin(angle) * this.speed;
		this.vy = Math.cos(angle) * this.speed;
	}

	draw(ctx, duration) {
		this.x += this.vx;
		this.y += this.vy;
		this.vx -= this.vx / 20;
		this.vy -= this.vy / 20;
		ctx.save();
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc(this.x, this.y, 2, Math.PI / 180 * 2, false);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}