import { Problem } from '/assets/js/problemset.js';
import { ProblemSet } from '/assets/js/problemset.js';

window.addEventListener('load', function() {
  const generateButton = document.getElementById('generateProblems');

  /* Add event listeners */
  generateButton.addEventListener('click', function() {
    const problems = new ProblemSet('arithmetic');
  });
  document.getElementById("maxMagnitudeSlider").oninput = function() { document.getElementById("maxMagnitudeValue").innerHTML = this.value; }
});
  
export class ArithmeticProblem extends Problem {
  constructor(params) {
    super();
    this.negativesAllowed = params.negativesAllowed == 'on';
    this.maxMagnitude = parseInt(params.maxMagnitudeSlider);
    this.ops = [];
    this.questionParts = [];

    if (params.additionCheck == 'on') { this.ops.push('+'); }
    if (params.subtractionCheck == 'on') { this.ops.push('-'); }
    if (params.multiplicationCheck == 'on') { this.ops.push('*'); }
    if (params.divisionCheck == 'on') { this.ops.push('/'); }

  }
}

ArithmeticProblem.prototype.generate = function() {
  let a = 0, b = 0, opChoice = 0, ans = 0;
  const min = this.negativesAllowed ? 0 - this.maxMagnitude : 0;
  const max = this.maxMagnitude;

  do {
    a = Problem.randomIntegerInRange(min, max);
    b = Problem.randomIntegerInRange(min, max);

    opChoice = Math.floor(Math.random() * this.ops.length);

    switch (this.ops[opChoice]) {
      case '+': ans = (a + b); break;
      case '-': ans = (a - b); break;
      case '*': ans = (a * b); break;
      case '/': ans = (a / b); break;
      default: ans = `Undefined Operation: ${opChoice}`;
    }
  } while ( !Number.isInteger(ans) || (!this.negativesAllowed && ans < 0) );

  this.questionParts.push(a, this.ops[opChoice], b);
  this.question = this.questionParts.join(' ');
  this.answer = ans;
}

ArithmeticProblem.prototype.approveProblem = function() {
}
