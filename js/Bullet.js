class Bullet {
	constructor(x, y, isEvil) {
		this.x = x;
		this.y = y;
		this.isEvil = isEvil;
		this.w = this.isEvil ? 30 : 40;
		this.h = 5;
	}

	draw(ctx, time) {
		this.x += (this.isEvil ? -3 : 15);

		let fillColor = this.isEvil ? 'salmon' : 'aqua';
		let strokeColor = this.isEvil ? 'red' : 'blue';
		ctx.save();
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = 2;
		ctx.fillStyle = fillColor;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.restore();
	}
}