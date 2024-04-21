window.addEventListener('load', function() {
  createProblems();
  setBindings();

  function setBindings() {
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

  function createProblems() {
    let problemsDiv = document.getElementById('problems');
    let solutionsDiv = document.getElementById('solutions');
    let n = 12; // number of problems (TODO - get from controls)
    let problems = new ProblemSet(n);

    problemsDiv.innerHTML = problems.getQuestions();
    solutionsDiv.innerHTML = problems.getAnswers();
  }

});


function ProblemSet(numQuestions) {
  this.questions = [];
  this.solutions = [];

  for (i = 1; i <= numQuestions; i++) {
    let problem = new Problem();
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
}

ProblemSet.prototype.getQuestions = function() {
  return this.questions.join('');
}

ProblemSet.prototype.getAnswers = function() {
  return this.solutions.join('');
}

/** generic problem - extend in each problem type */
function Problem(params) {
  this.question = '';
  this.answer = '';
}

/** placeholder function - override in each problem type */
Problem.prototype.generate = function() {
  let ops = ['+', '-', '*', '/'];
  let question = [];
  let a = 0, b = 0, opChoice = 0, ans = 0;

  do {
    a = Math.floor(Math.random() * 10);
    b = Math.floor(Math.random() * 10);
    opChoice = Math.floor(Math.random() * 4);


    switch (opChoice) {
      case 0: ans = (a + b); break;
      case 1: ans = (a - b); break;
      case 2: ans = (a * b); break;
      case 3: ans = (a / b); break;
      default: ans = `Undefined Operation: ${opChoice}`;
    }
  } while ( !Number.isInteger(ans) );

  question.push(a, ops[opChoice], b);
  this.question = question.join(' ');
  this.answer = ans;

}

Problem.prototype.toString = function() {
  let response = [];

  response.push(this.question, '=', this.answer);

  return response.join(' ');
}

Problem.prototype.getQuestion = function() {
  return this.question;
}

Problem.prototype.getAnswer = function() {
  return this.answer;
}
