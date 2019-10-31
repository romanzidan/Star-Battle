function randomBetween(num1, num2) {
	let max = Math.max(num1, num2);
	let min = Math.min(num1, num2);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function isColliding(box1, box2) {
	return !!(
		box1.x + box1.w > box2.x &&
		box1.x < box2.x + box2.w &&
		box1.y + box1.h > box2.y &&
		box1.y < box2.y + box2.h);
}