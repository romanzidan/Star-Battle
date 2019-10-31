class Engine {
	constructor() {
		this.state = 0;
		this.states = [new Instruction(), new Game(), new Gameover()];
		window.requestAnimationFrame(this.draw.bind(this));
		document.addEventListener('keydown', ev => {
			if (typeof this.activeState.keydown == 'function') {
				this.activeState.keydown(ev);
			}
		});
		document.addEventListener('keyup', ev => {
			if (typeof this.activeState.keyup == 'function') {
				this.activeState.keyup(ev);
			}
		});
		this.activeState.init();
	}

	draw(time) {
		this.activeState.draw(time);
		window.requestAnimationFrame(this.draw.bind(this));
	}

	changeState(state) {
		this.activeState.exit();
		this.state = state;
		this.activeState.init();
	}

	get activeState() {
		return this.states[this.state];
	}
}