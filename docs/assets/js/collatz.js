let collatzArray = [];

window.addEventListener('load', function() {
	collatzArray[1] = { steps: 0, used: true, path: "<li class=\"oddNum\">1</li>" };

	document.getElementById('pathButton').onclick = function(e) {
		let val = document.getElementById('value').value;

		clearResults();

		if (checkInput(val)) {
			calculate(BigInt(val));
		}
	}

	document.getElementById('statsButton').onclick = function(e) {
		let val = document.getElementById('value').value;

		clearResults();

		if (checkInput(val)) {
			statistics(BigInt(val));
		}
	}
});

function checkInput(val) {
	// check the input
	if (isNaN(val)) {
		errorMessage("Not a number. Please retry.");
		return false;
	}
	else if (0 >= val || val % 1 !== 0) {
		errorMessage("Number must be a positive integer greater than or equal to 1.");
		return false;
	}
	else {
		// input is a positive integer, yay, we can do stuff!
		return true;
	}
}

function statistics(num) {
	if (num > 10000) {
		errorMessage("Number is too large for this function.");
		return false;
	}

	document.getElementById('stats').innerHTML = "<table id=\"statistics\"><thead><tr><th>Number</th><th>Steps</th></tr></thead><tbody id=\"statsBody\"></tbody></table>";

	let result = ""
	for (let i = 1n; i <= num; i++) {
		nextStep(i);
		result = "<tr><td>" + i + "</td><td>" + collatzArray[i].steps + "</td></tr>" + result;
	}

	document.getElementById('statsBody').innerHTML = result;
}

function calculate(num)
{
	nextStep(num);

	printPath(collatzArray[num].path);
	document.getElementById('status').innerHTML = "Total Steps: " + collatzArray[num].steps;
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

function printPath(str)
{
	document.getElementById('path').innerHTML += str;
}

function clearResults()
{
	document.getElementById('stats').innerHTML = "";
	document.getElementById('results').innerHTML = "<ol id=\"path\"></ol><p role=\"status\" id=\"status\">&nbsp;</p>";
}

function errorMessage(str)
{
	document.getElementById('results').innerHTML = "<p><strong>Error:</strong> "+ str + "</p>";
}
