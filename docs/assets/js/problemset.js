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
    resizeBlocks(document.querySelectorAll('.questionBlock'));

    window.addEventListener('beforeprint', function() {
      document.getElementById('solutions').style.display = 'flex';
      resizeBlocks(document.querySelectorAll('.questionBlock'));
      resizeBlocks(document.querySelectorAll('.solutionBlock'));
    });
    window.addEventListener('afterprint', function() {
      document.getElementById('solutions').style.display = 'none';
    });
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
  let numProblems = (controls['numProblems'] || 1);
  if (numProblems > 99) { numProblems = 99; }

  for (let i = 1; i <= numProblems; i++) {
    const problem = new problemClass(controls);
    problem.generate();

    questions.push(`<div id="problem${i}" class="problem questionBlock">`);
    questions.push(`<span class="questionNumber">${i}. </span>`);
    questions.push('<span class="question equation">');
    questions.push(problem.getQuestion());
    questions.push('</span>');
    questions.push(`<button class="reveal" id="show${i}">Show Solution</button>`);
    questions.push('</div>');

    solutions.push(`<div id="solution${i}" class="solutionBlock">`);
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
  const showButtons = document.querySelectorAll('button.reveal');
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

/* Figure out maximum width among a set of elements, then set all others to match */
function resizeBlocks(elements) {
  // reset to auto to allow elements to adjust based on content
  elements.forEach(function(block) {
    block.style.width = 'auto';
  });

  document.body.offsetWidth; // trigger a reflow to update styles

  // calculate maximum width for a question, and set all to match
  let maxWidth = getMaxWidth(elements) * 1.1;
  elements.forEach(function(block) {
    block.style.width = maxWidth + 'px';
  });
}

function getMaxWidth(elements) {
  let maxWidth = 0;
  elements.forEach(function(block) {
    if (block.clientWidth > maxWidth) { maxWidth = block.clientWidth; }
  });
  return maxWidth;
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
