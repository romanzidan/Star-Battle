class Timer {
	constructor(interval, callback) {
		this.interval = interval;
		this.callback = callback;
		this.countdown = interval;
	}

	tick(time) {
		this.countdown -= time;
		if (this.countdown <= 0) {
			this.callback();
			this.countdown += this.interval;
		}
	}
}