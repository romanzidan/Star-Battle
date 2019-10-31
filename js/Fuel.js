class Fuel extends Sprite {
	constructor(x, y) {
		super(Fuel.image, x, y, 35, 60);
		this.vx = (randomBetween(0, 50) - 25) / 10;
	}

	draw(ctx, time) {
		this.rotation += 0.5;
		this.y += 2;
		this.x += this.vx;
		super.draw(ctx, time);
	}
}

Fuel.image = document.querySelector('#asset-fuel');