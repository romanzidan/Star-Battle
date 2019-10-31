class Enemy extends Sprite {
	constructor(x, y) {
		super(Enemy.image, x, y, 60, 50, 4, 70, 0);
	}

	draw(ctx, time) {

		this.x--;
		super.draw(ctx, time);
	}
}
Enemy.image = document.querySelector('#asset-enemy');