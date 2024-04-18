let collatzArray = [];

window.onload = function()
{
	collatzArray[1] = { steps: 0, used: true, path: "<li class=\"oddNum\">1</li>" };

	document.getElementById('calcButton').onclick = function(e) {
		clearPath();
		calculate(document.getElementById('value').value);
	}
}

function calculate(num)
{
	// check the input
	if (isNaN(num))
		message("Not a number. Please retry.");
	else if (0 >= num || num % 1 !== 0)
		message("Number must be a positive integer greater than or equal to 1.");
	else  // input is a positive integer, yay, do stuff!
	{
		num = BigInt(num);
		nextStep(num);

		printPath(collatzArray[num].path);
		document.getElementById('status').innerHTML = "Total Steps: " + collatzArray[num].steps;
	}
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

function clearPath()
{
	document.getElementById('results').innerHTML = "<ol id=\"path\"></ol><p role=\"status\" id=\"status\">&nbsp;</p>";
}

function message(str)
{
	document.getElementById('results').innerHTML = "<p><strong>Error:</strong> "+ str + "</p>";
}
