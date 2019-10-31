class Gameover {
	constructor() {
		this.el = $('#gameover');
		this.table = $('#score-table');
	}

	draw() {

	}

	init() {
		this.el.css('display', 'flex');
		// get scores
		this.scores = window.scores;
		this.scores.sort((a, b) => {
			if (a.score == b.score) {
				return b.time - a.time;
			}
			return b.score - a.score;
		});
		this.table.html(`
			<tr>
				<th>Position</th>
				<th>Name</th>
				<th>Score</th>
				<th>Time</th>
			</tr>
		`);

		let rank = -1;
		let previousScore = this.scores[0];
		for (let i = 0; i < 10 && i < this.scores.length; i++) {
			let rec = this.scores[i];
			if (i == 0 || 
				rec.score != previousScore.score || rec.time != previousScore.time) {
				rank++;
			}
			previousScore = rec;
			this.table.append(`
				<tr>
					<td>${rank + 1}.</td>
					<td>${rec.name}</td>
					<td>${rec.score}</td>
					<td>${rec.time}</td>
				</tr>
			`);
		}

	}

	exit() {
		this.el.hide();
	}
}