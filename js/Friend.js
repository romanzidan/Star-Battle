class Friend extends Sprite {
	constructor(x, y) {
		super(Friend.image, x, y, 60, 50, 4, 70, 0);

	}

	draw(ctx, time) {
		this.x--;
		super.draw(ctx, time);
	}
}
Friend.image = document.querySelector('#asset-friend');