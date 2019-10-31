class Sprite {
	constructor(img, x, y, w, h, animCount, animSpeed, rotation) {
		this.img = img;
		this.x = x;
		this.y = y;
		this.w = w || 0;
		this.h = h || 0;
		this.animCount = animCount || 1;
		this.animSpeed = animSpeed || 30;
		this.rotation = rotation || 0;
		this.animIndex = 0;
		this.animCd = this.animSpeed;
	}

	draw(ctx, time) {
		// animation
		this.animCd -= time;
		if (this.animCd <= 0) {
			this.animCd += this.animSpeed;
			this.animIndex++;
			if (this.animIndex >= this.animCount) {
				this.animIndex = 0;
			}
		}

		// choose image
		let sw = this.img.width / this.animCount;
		let sx = sw * this.animIndex;
		let sy = 0;
		let sh = this.img.height;


		// draw image
		ctx.save();
		if (this.rotation != 0) {
			ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
			ctx.rotate(Math.PI / 180 * this.rotation);
			ctx.drawImage(this.img, sx, sy, sw, sh, -this.w / 2, -this.h / 2, this.w, this.h);
		} else {
			ctx.drawImage(this.img, sx, sy, sw, sh, this.x, this.y, this.w, this.h);
		}
		ctx.restore();
	}
}