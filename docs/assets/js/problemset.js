import { Utils } from '/assets/js/utils.js';
import { ArithmeticProblem } from '/assets/js/arithmetic.js';
import { PolynomialProblem } from '/assets/js/polynomial.js';

window.addEventListener('load', function() {
  const generateButton = document.getElementById('generateProblems');
  const problemType = generateButton.getAttribute('data-problem-type');

  generateButton.addEventListener('click', function() {
    generateProblemSet(problemType);
  });
});

function generateProblemSet(problemType) {
  try {
    const problemClass = getProblemClass(problemType)
    createProblems(problemClass);
    setShowBindings();
  } catch(e) {
     console.log(e);
     this.problemsDiv.innerHTML = '<strong>Error:</strong> ' + e.message;
  }
}

function createProblems(problemClass) {
  /* Get the HTML containers */
  const problemsDiv = document.getElementById('problems');
  const solutionsDiv = document.getElementById('solutions');
  const questions = [];
  const solutions = [];

  const controls = Utils.getFormInputs('#controls');

  /* Loop through and create all problems */
  let numQuestions = (controls['numProblems'] || 1);
  if (numProblems > 99) { numProblems = 99; }

  for (let i = 1; i <= numQuestions; i++) {
    const problem = new problemClass(controls);
    problem.generate();

    questions.push(`<div id="problem${i}" class="problem questionBlock">`);
    questions.push(`<span class="questionNumber">${i}. </span>`);
    questions.push('<span class="question equation">');
    questions.push(problem.getQuestion());
    questions.push('</span>');
    questions.push(`<button class="reveal" id="show${i}">Show Solution</button>`);
    questions.push('</div>');

    solutions.push(`<div id="solution${i}" class="solution equation">`);
    solutions.push(`<span class="questionNumber">${i}. </span>`);
    solutions.push(`<span id="answer${i}" class="solution equation">`);
    solutions.push(problem.getAnswer());
    solutions.push('</span>');
    solutions.push('</div>');

  }

  /* Add the problems and solutions to the page */
  problemsDiv.innerHTML = questions.join('');
  solutionsDiv.innerHTML = solutions.join('');
}

/* Bind each 'show answer' button to reveal the appropriate answer */
function setShowBindings() {
  let showButtons = document.querySelectorAll('button.reveal');
  showButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var solutionId = this.id.replace('show', 'answer');

      var solution = document.getElementById(solutionId);

      if (solution && button.parentNode) {
	button.parentNode.replaceChild(solution.cloneNode(true), button);
      } else {
        console.log('setShowBindings: solution or parentNode is null');
      }
    });
  });
}

/* Determine problem type (passed in from calling function) */
function getProblemClass(problemType) {
  const problemClasses = {
    "arithmetic": ArithmeticProblem,
    "polynomial": PolynomialProblem,
  }

  const problemClass = problemClasses[problemType];
  if (!problemClass) {
    console.log('Undefined problem type: ' + problemType);
    throw new Error('No ' + problemType + ' problems available.');
    return;
  }

  return problemClass;
}
