window.addEventListener('load', function() {
	let collatzArray = [];
	let stats = { maxSteps: { num: 1, steps: 0 }, stepDist: [], counter: 0 };
	collatzArray[1] = { steps: 0, used: true, path: "<li class=\"oddNum\">1</li>" };

	document.getElementById('pathButton').onclick = function(e) {
		let val = document.getElementById('value').value;
		let resultElement = document.getElementById('results');
		let resultStr = "";


		resultElement.innerHTML = "";

		try {
			let num = BigInt(val);
			if (num <= 0) throw new Error("Number must be a positive integer.");
			nextStep(num);
			resultStr += "<p role=\"status\" id=\"status\">Total Steps: " + collatzArray[num].steps + "</p>";
			resultStr += "<ol id=\"path\">" + collatzArray[num].path + "</ol>"
		} catch(e) {
			resultStr = "<strong>Error:</strong> " + e.message;
		} finally {
			resultElement.innerHTML = resultStr;
		}
	}

	document.getElementById('statsButton').onclick = function(e) {
		let val = document.getElementById('value').value;
		let resultElement = document.getElementById('results');
		let resultStr = "";

		resultElement.innerHTML = "";

		try {
			let num = BigInt(val);
			if (num <= 0) throw new Error("Number must be a positive integer.");
			resultStr = statistics(num);
		} catch(e) {
			resultStr = "<strong>Error:</strong> " + e.message;
		} finally {
			resultElement.innerHTML = resultStr;
		}
	}

	function statistics(num) {
		if (num > 10000) {
			throw new Error("Number is too large for this function.");
		}

		nextStep(num);

		let result = "";
		let maxSteps = { num: 1, steps: 0 };
		let counter = collatzArray.filter(function(el) { return el && el.used; }).length;
		let stepDist = [];

		for (let i = 1n; i <= num; i++) {
			if (!collatzArray[i]) continue;  // Not every number is done yet

			if (!stepDist[collatzArray[i].steps]) stepDist[collatzArray[i].steps] = 0;
			stepDist[collatzArray[i].steps]++;

			if (collatzArray[i].steps > maxSteps.steps) {
				maxSteps.num = i;
				maxSteps.steps = collatzArray[i].steps;
			}
		}

		result += "<p>" + counter + " numbers calculated.</p>";
		result += "<p>Maximum Steps: " + maxSteps.steps + " steps for " + maxSteps.num + "</p>";
		result += "Distribution:<table><thead><tr><th>Steps</th><th>Times Occurred</th></tr></thead><tbody>";
		for (i = 0; i <= maxSteps.steps; i++) {
			if (stepDist[i]) {
				result += "<tr><td>" + i + "</td><td>" + stepDist[i] + "</td></tr>";
			}
		}
		result += "</tbody></table>";

		return result;
	}

	function nextStep(num) {
		let isEven = num % 2n == 0n;

		if (collatzArray[num] && collatzArray[num].used) {
			return collatzArray[num].steps;
		}

		let nextNum = isEven ? (num/2n) : (3n * num + 1n);

		collatzArray[num] = { used: true };

		collatzArray[num].steps = nextStep(nextNum) + 1;
		collatzArray[num].path = "<li class=\""+ (isEven ? "evenNum" : "oddNum") + "\">" + num + "</li>" + collatzArray[nextNum].path;

		return collatzArray[num].steps;
	}
});
