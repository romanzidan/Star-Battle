class Instruction {
	constructor() {
		this.el = $('#instruction');
	}

	init() {
		this.el.css('display', 'flex');
	}

	draw() {
		
	}

	exit() {
		this.el.hide();
	}
}