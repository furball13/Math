import { Utils } from '/assets/js/utils.js';
import { Problem } from '/assets/js/problemset.js';
import { ProblemSet } from '/assets/js/problemset.js';

window.addEventListener('load', function() {
  /* Add event listeners */
  document.getElementById('generateProblems').addEventListener('click', function() {
    const problems = new ProblemSet('arithmetic');
  });
});
  
export class ArithmeticProblem extends Problem {
  constructor(params) {
    super();
    this.negativesAllowed = params.negativesAllowed;
    this.maxMagnitude = parseInt(params.maxMagnitude);
    this.ops = [];
    this.questionParts = [];

    if (params.additionCheck) { this.ops.push('+'); }
    if (params.subtractionCheck) { this.ops.push('-'); }
    if (params.multiplicationCheck) { this.ops.push('&times;'); }
    if (params.divisionCheck) { this.ops.push('&divide;'); }

  }
}

ArithmeticProblem.prototype.generate = function() {
  let a = 0, b = 0, opChoice = 0, ans = 0;
  const min = this.negativesAllowed ? 0 - this.maxMagnitude : 0;
  const max = this.maxMagnitude;

  do {
    a = Utils.randomIntegerInRange(min, max);
    b = Utils.randomIntegerInRange(min, max);

    opChoice = Math.floor(Math.random() * this.ops.length);

    switch (this.ops[opChoice]) {
      case '+': ans = (a + b); break;
      case '-': ans = (a - b); break;
      case '&times;': ans = (a * b); break;
      case '&divide;': ans = (a / b); break;
      default:
        console.log(`Undefined Operation: ${opChoice}`);
	throw new Error('Please choose a valid operation.');
    }
  } while ( !Number.isInteger(ans) || (!this.negativesAllowed && ans < 0) );

  this.questionParts.push(
    ((a < 0) ? '(' : ''), a, ((a < 0) ? ')' : ''),
    this.ops[opChoice],
    ((b < 0) ? '(' : ''), b, ((b < 0) ? ')' : ''),
    );
  this.question = this.questionParts.join(' ');
  this.answer = ans;
}
