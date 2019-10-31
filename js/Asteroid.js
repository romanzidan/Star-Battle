class Asteroid extends Sprite {
	constructor(x, y) {
		let idx = randomBetween(0, Asteroid.images.length - 1);
		let sprites = Asteroid.images[idx];
		let img = sprites[2];
		super(img, x, y, img.width / 5, img.height / 5);
		this.sprites = sprites;
		this.lives = 2;
		this.rotation = 0;
	}

	draw(ctx, time) {
		this.rotation += 0.3;
		this.x -= 2;

		super.draw(ctx, time);
	}

}

Asteroid.images = [];
for (let i = 1; i <= 4; i++) {
	Asteroid.images.push({
		1: document.querySelector('#asset-asteroid-crack-' + i),
		2: document.querySelector('#asset-asteroid-' + i),
	});
}