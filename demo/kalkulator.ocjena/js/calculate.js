function Calculator() {

	// default options
	var options = {
		score: {
			min: 5,
			max: 99999,
			val: 100
		},
		positive: {
			min: 1,
			max: 97,
			val: 50
		},
		step: {
			num: 1,
			pri: [3, 2, 4, 5]
		}
	}

	// steps between each grade
	var steps = {
		1 : 49,
		2 : 12,
		3 : 12,
		4 : 12,
		5 : 11
	}

	// calculate steps
	var calc = function() {
		var half = options.score.val * (options.positive.val / 100);
		if(Math.floor(half) != half) {
			half = Math.floor(half)
		} else {
			half = half - 1;
		}

		var step = Math.floor((options.score.val - half) / 4 )

		steps[1] = half;
		steps[2] = step - 1;
		steps[3] = step - 1;
		steps[4] = step - 1;
		steps[5] = step - 1;

		var all = steps[1] + 1 + steps[2] + 1 + steps[3] + 1 + steps[4] + 1 + steps[5];
		var i   = 0;
		while(all < options.score.val) {
			steps[options.step.pri[i]] += 1;
			all                             += 1;
			i                               += 1;

			if(i == options.step.pri.length) {
				i = 0;
			}
		}
	}

	// get/set score option
	this.score = function(value) {
		if((!isNaN(parseFloat(value))) && (isFinite(value))) {
			if(Math.round(value * 1) < options.score.min) {
				options.score.val = Math.round(options.score.min);
			} else if(Math.round(value * 1) > options.score.max) {
				options.score.val = Math.round(options.score.max);
			} else {
				options.score.val = Math.round(value * 1);
			}
		}

		return options.score.val;
	}

	// get/set positive option
	this.positive = function(value) {
		if((!isNaN(parseFloat(value))) && (isFinite(value))) {
			if(Math.round(value * 1) < options.positive.min) {
				options.positive.val = Math.round(options.positive.min, 2);
			} else if(Math.round(value * 1) > options.positive.max) {
				options.positive.val = Math.round(options.positive.max, 2);
			} else {
				options.positive.val = Math.round(value * 1, 2);
			}
		}

		return options.positive.val;
	}

	// refresh table
	this.refresh = function(callback) {
		calc();

		var result     = {};
		for(var i = 1; i <= 5; i++) {
			var last = 0;
			for(var j = 1; j < i; j++) {
				if(steps[j] >= 0) {
					last += steps[j] + 1;
				}
			}

			result[i]      = {}
			result[i].from = last;
			result[i].to   = last + steps[i];

			if((steps[i] < 0) || (result[i].from.toString() == 'NaN') || (result[i].to.toString() == 'NaN')) {
				result[i]  = false;
			}

		}

		if(typeof(callback) == 'function') {
			callback.call(this, result);
		}
	}

}
