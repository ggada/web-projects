var dateEL = document.querySelector('#form-day');
var monthEL = document.querySelector('#form-month');
var yearEL = document.querySelector('#form-year');
var message = [];
var today = new Date();
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//var dateEnd = ["th" ,"st", "nd", "rd", "th", "th", "th", "th", "th", "th"];
paper.install(window);

var dayBool;
var monthBool;
var yearBool;

function getYears(b) {
	var t = new Date();
	return new Date(0, t.getMonth(), t.getDate()) >= new Date(0, b.getMonth(), b.getDate()) ? t.getFullYear() - b.getFullYear() : t.getFullYear() - b.getFullYear() - 1;
};

function getWeeks(b) {
	var last_b = new Date(b.getFullYear() + getYears(b), b.getMonth(), b.getDate());
	return Math.floor((new Date() - last_b) / 1000 / 60 / 60 / 24 / 7);
};

function getDays(b) {
	var last_b = new Date(b.getFullYear() + getYears(b), b.getMonth(), b.getDate());
	return Math.floor((new Date() - last_b) / 1000 / 60 / 60 / 24);
}

function makeCanvas(day, month, year) {
	paper.setup('myCanvas');
	var canvasWidth = document.querySelector('#myCanvas').offsetWidth;
	var canvasBorder = canvasWidth * 0.03;
	paper.view.viewSize.width = canvasWidth;
	var square_size = (canvasWidth - 2 * canvasBorder) / 81;
	paper.view.viewSize.height = square_size * 142;

	var tot_years = getYears(new Date(year, month - 1, day));
	var tot_weeks = getWeeks(new Date(year, month - 1, day));
	var tot_days = getDays(new Date(year, month - 1, day));

	for (y = 1; y <= 90; y += 1) {
		for (x = 1; x <= 52; x += 1) {
			//draw blank square
			var rectangle = new Rectangle(new Point(canvasBorder + square_size * 1.5 * x, canvasBorder + y * (square_size * 1.5)), new Size(square_size, square_size));
			var cornerSize = new Size(square_size / 8, square_size / 8);
			var path = new Path.RoundRectangle(rectangle, cornerSize);
			path.strokeColor = 'black';
			path.strokeWidth = square_size / 8;

			//add extra day circles because a year isn't exactly 52 weeks
			if (x == 52) {
				if ((year + y) % 4 == 0) {
					// 2 circles for a leap year
					if (y <= tot_years) {
						createCircle(x, y, true);
						createCircle(x + 0.7, y, true);
					} else if (y == tot_years + 1) {
						if (tot_days == 365) {
							createCircle(x, y, true);
							createCircle(x + 0.7, y, false);
						} else {
							createCircle(x, y, false);
							createCircle(x + 0.7, y, false);
						}
					} else {
						createCircle(x, y, false);
						createCircle(x + 0.7, y, false);
					}
				} else {
					// 1 circle for a non-leap year
					if (y <= tot_years) {
						createCircle(x, y, true);
					} else {
						createCircle(x, y, false);
					}
				}
			}

			function createCircle(x, y, fillFlag) {
				var day_circle = new Path.Circle(new Point(canvasBorder + square_size * 1.5 * (x + 1) + 2, canvasBorder + y * (square_size * 1.5) + 2.5), square_size / 5);
				day_circle.strokeColor = 'black';
				day_circle.strokeWidth = square_size / 8;
				if (fillFlag) day_circle.fillColor = 'black';
			}
			if (y <= tot_years) path.fillColor = 'black';

			// fill running year
			if (y == tot_years + 1) {
				if (x <= tot_weeks) path.fillColor = 'black';
			}
		}
	}
	view.draw();
};

function setProgressBarHeight() {
	var barHeight = document.querySelector('#head-ul').getBoundingClientRect().top + document.querySelector('#head-ul').getBoundingClientRect().height - 6;
	barHeight >= 0 ? NProgress.configure({ topPosition: barHeight }) : NProgress.configure({ topPosition: 0 });
};

function printweeks() {
	setProgressBarHeight();
	NProgress.start();
	document.querySelector('#date-button').disabled = true;
	date_val = parseInt(document.querySelector('#form-day').value);
	month_val = parseInt(document.querySelector('#form-month').value);
	year_val = parseInt(document.querySelector('#form-year').value);
	makeCanvas(date_val, month_val, year_val);
	document.querySelector('#date-button').disabled = false;
	NProgress.done();
};

function displayMessage(m1, m2, m3) {
	if (m1 == null) m1 = "";
	if (m2 == null) m2 = "";
	if (m3 == null) m3 = "";
	messages.textContent = m1 + " " + m2 + " " + m3;
	if (dayBool && monthBool && yearBool) document.querySelector('#date-button').style.display = "block";
};

dateEL.addEventListener('input', function () {
	var date_num = parseInt(dateEL.value.replace(/[^0-9]/g, ""));
	if (date_num > 0 && date_num < 32) {
		message[0] = date_num; // + dateEnd[Math.floor(date_num%10)];
		dayBool = true;
	} else message[0] = "(Invalid Day)";
	displayMessage(message[0], message[1], message[2]);
});

monthEL.addEventListener('input', function () {
	var month_num = parseInt(monthEL.value.replace(/[^0-9]/g, ""));
	if (month_num > 0 && month_num < 13) {
		message[1] = monthNames[month_num - 1];
		monthBool = true;
	} else message[1] = "(Invalid Month)";
	displayMessage(message[0], message[1], message[2]);
});

yearEL.addEventListener('input', function () {
	var year_num = parseInt(yearEL.value.replace(/[^0-9]/g, ""));
	if (year_num > 1900 && year_num <= today.getFullYear()) {
		message[2] = year_num;
		yearBool = true;
	} else message[2] = "(Invalid Year)";
	displayMessage(message[0], message[1], message[2]);
});
