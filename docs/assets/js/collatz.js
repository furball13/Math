let collatzArray = [];

window.addEventListener('load', function() {
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
		let statsElement = document.getElementById('stats');
		let resultStr = "";
		let pathStr = "";
		let statsStr = "";


		pathElement.innerHTML = "";
		resultElement.innerHTML = "";
		statsElement.innerHTML = "<table id=\"statistics\"><thead><tr><th>Number</th><th>Steps</th></tr></thead><tbody id=\"statsBody\"></tbody></table>";

		let statsBody = document.getBodyById('stats');
		statsBody.innerHTML = "";

		try {
			statsStr = statistics(BigInt(val));
			pathStr += collatzArray[num].path;
	  		resultStr = "Total Steps: " + collatzArray[num].steps;
		} catch(e) {
			resultStr = "<strong>Error:</strong> " + e.message;
			statsElement.innerHTML = "";
		} finally {
			resultElement.innerHTML = resultStr;
			resultElement.innerHTML += pathStr;
			statsBody = statsStr;
		}
	}
});

function statistics(num) {
	if (num > 10000) {
		errorMessage("Number is too large for this function.");
		return false;
	}

	let result = ""
	for (let i = 1n; i <= num; i++) {
		nextStep(i);
		result = "<tr><td>" + i + "</td><td>" + collatzArray[i].steps + "</td></tr>" + result;
	}

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
