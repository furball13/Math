window.addEventListener('load', function() {
  createProblems();
  setBindings();

  function setBindings() {
    let showButtons = document.querySelectorAll('button.reveal');
    showButtons.forEach(function(button) {
      button.addEventListener('click', function() {
	var buttonId = this.id;
	var solutionId = buttonId.replace('show', 'solution');

	var solution = document.getElementById(solutionId);

	button.parentNode.replaceChild(solution.cloneNode(true), button);
      });
    });
  }

  function createProblems() {
    let n = 12; // number of problems (TODO - get from controls)
    let problems = [];
    let solutions = [];

    // TODO - actually generate the problems - need to handle different problem types and varying control inputs
    for (i = 1; i <= n; i++) {
      let problem = [], solution = [];

      problem.push(`<div id="problem${i}" class="problem"><div class="questionBlock">`);
      problem.push(`<span class="questionNumber">${i}.</span><div class="question">${i} + ${i}</div>`); // TODO - get the actual question
      problem.push(`</div><button class="reveal" id="show${i}">Show Solution</button></div>`);

      solution.push(`<div id="solution${i}" class="solution">`);
      solution.push(`The answer is: ${i+i}`);  // TODO - get the actual answer
      solution.push(`</div>`);

      problems[i] = problem.join("");
      solutions[i] = solution.join("");
    }

    document.getElementById('problems').innerHTML = problems.join("");
    document.getElementById('solutions').innerHTML = solutions.join("");
  }
});
