import { ArithmeticProblem } from '/assets/js/arithmetic.js';

export class ProblemSet {
  constructor(problemType) {
    this.questions = [];
    this.solutions = [];

    /* Get the HTML containers */
    this.problemsDiv = document.getElementById('problems');
    this.solutionsDiv = document.getElementById('solutions');
    this.controlsDiv = document.getElementById('controls');

    
    try {
      this.problemClass = ProblemSet.determineType(problemType)
      this.createProblems();
      this.setShowBindings();
    } catch(e) {
       this.problemsDiv.innerHTML = '<strong>Error:</strong> ' + e.message;
    }
  }

  /* Determine problem type (passed in from calling function) */
  static determineType(problemType) {
    const problemClasses = {
      "arithmetic": ArithmeticProblem,
      //"polynomial": PolynomialProblem,
    }

    const problemClass = problemClasses[problemType];
    if (!problemClass) {
      console.log('Undefined problem type: ' + problemClass);
      throw new Error('No problems available yet.');
      return;
    }

    return problemClass;
  }
}

ProblemSet.prototype.createProblems = function() {
  /* Get form controls from page */
  const controls = [];
  this.controlsDiv.querySelectorAll('input').forEach(function(field) {
    controls[field.id] = field.value;
  })
  const problem = new this.problemClass(controls);

  /* Loop through and create all problems */
  let numQuestions = (controls["numProblems"] || 1);
  for (let i = 1; i <= numQuestions; i++) {
    problem.generate();

    this.questions.push(`<div id="problem${i}" class="problem questionBlock">`);
    this.questions.push(`<span class="questionNumber">${i}. </span>`);
    this.questions.push('<span class="question equation">');
    this.questions.push(problem.getQuestion());
    this.questions.push('</span>');
    this.questions.push(`<button class="reveal" id="show${i}">Show Solution</button>`);
    this.questions.push('</div>');

    this.solutions.push(`<div id="solution${i}" class="solution equation">`);
    this.solutions.push(`<span class="questionNumber">${i}. </span>`);
    this.solutions.push(`<span id="answer${i}" class="solution equation">`);
    this.solutions.push(problem.getAnswer());
    this.solutions.push('</span>');
    this.solutions.push('</div>');

  }

  /* Add the problems and solutions to the page */
  this.problemsDiv.innerHTML = this.questions.join('');
  this.solutionsDiv.innerHTML = this.solutions.join('');

  /* Bind "show solution" buttons */
  this.setShowBindings();
}

ProblemSet.prototype.setShowBindings = function() {
  let showButtons = document.querySelectorAll('button.reveal');
  showButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var buttonId = this.id;
      var solutionId = buttonId.replace('show', 'answer');

      var solution = document.getElementById(solutionId);

      button.parentNode.replaceChild(solution.cloneNode(true), button);
    });
  });
}

ProblemSet.prototype.getQuestions = function() {
  return this.questions.join('');
}

ProblemSet.prototype.getAnswers = function() {
  return this.solutions.join('');
}

/** generic problem - extend in each problem type */
export class Problem {
  constructor(params) {
    this.params = params;
    this.question = '';
    this.answer = '';
  }

  static randomIntegerInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

/** placeholder function - override in each problem type */
Problem.prototype.generate = function() {
}

Problem.prototype.getQuestion = function() {
  return this.question;
}

Problem.prototype.getAnswer = function() {
  return this.answer;
}

Problem.prototype.toString = function() {
  let response = [];

  response.push(this.question, '=', this.answer);

  return response.join(' ');
}
