import { Utils } from '/assets/js/utils.js';
import { Problem } from '/assets/js/problem.js';

export class FractionProblem extends Problem {
  constructor(params) {
    super();
    this.negativesAllowed = params.negativesAllowed;
    this.maxDenominator = parseInt(params.maxDenominatorSlider);
    this.mixedNumbers = params.mixedNumbers;
    this.commonDenominator = params.commonDenominator;
    this.regroupingRequired = params.regroupingRequired;
    this.simplifyAnswer = params.simplifyAnswer;
    this.ops = [];
    this.firstTerm = { whole: 0, num: 1, denom: 3 };
    this.secondTerm = { whole: 0, num: 1, denom: 3 };
    this.solution = { whole: 0, num: 2, denom: 3 };

    if (params.additionCheck) { this.ops.push('+'); }
    if (params.subtractionCheck) { this.ops.push('-'); }
    if (params.multiplicationCheck) { this.ops.push('&times;'); }
    if (params.divisionCheck) { this.ops.push('&divide;'); }
  }
}

FractionProblem.prototype.generate = function() {
  this.opChoice = Math.floor(Math.random() * this.ops.length);
  this.generateFirstTerm();
  //this.generateSecondTerm();  // includes calculating answer
  this.buildDisplay();
}

/** Generate a single fraction or mixed number within the parameters */
FractionProblem.prototype.generateFirstTerm = function() {
  if (this.mixedNumbers != 'never') {
    do {
      this.firstTerm.whole = Math.floor(Math.random() * 10);
    } while (this.mixedNumbers == 'always' && this.firstTerm.whole == 0);
  }

  this.firstTerm.denom = Math.floor(Math.random() * (this.maxDenominator - 1) + 2);

  let gcf = 1;
  do {
    gcf = 1;
    this.firstTerm.num = Math.floor(Math.random() * (this.firstTerm.denom - 1) + 1);

    // make sure generated fractions are fully reduced
    for (let i = this.firstTerm.num; i > 1; i--) {
      if (this.firstTerm.num % i == 0 && this.firstTerm.denom % i == 0) {
	gcf = i;
      }
    }
  } while (gcf > 1);
}

/** Generate a second fraction within the parameters, that also gives an answer within parameters */
FractionProblem.prototype.generateSecondTerm = function() {
/*
  let an = 0, ad = 1, bn = 0, bd = 1, opChoice = 0, ans = 0;
  const oneMax = this.oneMagnitude;
  const twoMin = this.negativesAllowed ? 0 - this.twoMagnitude : 0;
  const twoMax = this.twoMagnitude;

  do {
    ad = Utils.randomIntegerInRange(2, this.maxDemoninator);
    b = Utils.randomIntegerInRange(twoMin, twoMax);

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
  */
}

FractionProblem.prototype.buildDisplay = function() {
  let questionParts = [];
  let answerParts = [];

  questionParts.push(
    '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">',
    '<mrow>',
    '<mn>', this.firstTerm.whole || '', '</mn>',
    '<mfrac>',
    '<mn>', this.firstTerm.num, '</mn>',
    '<mn>', this.firstTerm.denom, '</mn>',
    '</mfrac>',
    '<mo>', this.ops[this.opChoice], '</mo>',
    '<mn>', this.secondTerm.whole || '', '</mn>',
    '<mfrac>',
    '<mn>', this.secondTerm.num, '</mn>',
    '<mn>', this.secondTerm.denom, '</mn>',
    '</mfrac>',
    '</mrow>',
    '</math>',
    );

  answerParts.push(
    '<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">',
    '<mrow>',
  );

  if (this.solution.whole) {
    answerParts.push('<mn>', this.solution.whole, '</mn>');
  }

  if (this.solution.num) {
    answerParts.push(
      '<mfrac>',
      '<mn>', this.solution.num, '</mn>',
      '<mn>', this.solution.denom, '</mn>',
      '</mfrac>',
    );
  }

  answerParts.push(
    '</mrow>',
    '</math>',
  );

  this.question = questionParts.join('');
  this.answer = answerParts.join('');
}

window.addEventListener('load', function() {
  const sliders = ['maxDenominator'];
  try {
    for (let i = 0; i < sliders.length; i++) {
      const sliderElement = document.getElementById(sliders[i] + 'Slider');
      if (sliderElement) {
        sliderElement.addEventListener('input', function() {
	  Utils.updateSliderValue(sliderElement);
	});
      }
    }
  } catch(e) {
    console.log('fractions.js:addEventListener error: ' + e.message);
  }
});
