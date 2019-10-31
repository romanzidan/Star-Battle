class Planet extends Sprite {
	constructor(x, y) {
		let idx = randomBetween(0, Planet.images.length - 1);
		let img = Planet.images[idx];
		super(img, x, y, img.width / 5, img.height / 5);
		this.rotation = 0;
		this.size = Math.sqrt(img.width * img.height);
	}

	draw(ctx, time) {
		this.rotation += this.size / 1000;
		this.x -= this.size / 300;

		super.draw(ctx, time);
	}

}

Planet.images = [];
for (let i = 1; i <= 7; i++) {
	Planet.images.push(document.querySelector('#asset-planet-' + i));
}