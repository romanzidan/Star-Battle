class Player extends Sprite {
	constructor() {
		let sprite = document.querySelector('#asset-spaceship');
		super(sprite, 100, 100, 60, 40, 4, 50, 0);
		this.left = this.right = this.up = this.down = false;
		this.speed = 1;
		this.vx = 0;
		this.vy = 0;
	}

	draw(ctx, time) {
		if (this.right) this.vx += this.speed;
		if (this.left) this.vx -= this.speed;
		if (this.down) this.vy += this.speed;
		if (this.up) this.vy -= this.speed;

		this.x += this.vx;
		this.y += this.vy;
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		if (this.x + this.w > 960) this.x = 960 - this.w;
		if (this.y + this.h > 600) this.y = 600 - this.h;

		this.vx /= 1.1;
		this.vy /= 1.1;

		super.draw(ctx, time);
	}
}