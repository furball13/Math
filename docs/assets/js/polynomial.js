import { Utils } from '/assets/js/utils.js';
import { Problem } from '/assets/js/problem.js';

/** Generate a factorable polynomial - returns { question, solution } */
export class PolynomialProblem extends Problem {
  constructor(params) {
    super();
    this.degree = parseInt(params.degreeSlider);
    this.maxCoeff = parseInt(params.coeffSlider);
    this.minConst = parseInt(params.minConstSlider);
    this.maxConst = parseInt(params.maxConstSlider);
    this.noGCF = params.noGCF;
    this.factors = [];
    this.gcf = 1;
    this.question = '';
    this.answer = '';
  }
}

PolynomialProblem.prototype.generate = function() {
  // randomly generate factors (ax + b)
  // factors are stored in 2d array - each entry is [a, b]
  for (let i = 0; i < this.degree; i++) {
    let ce = 0;
    let cn = 0;
    let factor = {};

    do {
      if (this.noGCF) {
        this.gcf = 1;
      }
      // randomize a coefficient for the factor (a in (ax + b))
      while (ce == 0) {
	ce = Math.floor(Math.random() * this.maxCoeff + 1);
      }

      // randomize a constant for the factor (b in (ax + b))
      while (cn == 0) {
	cn = Math.floor(Math.random() * (this.maxConst - this.minConst + 1)) + this.minConst;
      }

      // check for common factors
      for (let i = Math.min(Math.abs(ce), Math.abs(cn)); i > 0; i--) {
	if (ce % i == 0 && cn % i == 0) {
	  ce /= i;
	  cn /= i;
	  this.gcf *= i;
	}
      }
    } while (this.noGCF && this.gcf > 1);

    factor.coefficient = ce;
    factor.constant = cn;
    this.factors.push(factor);
  }

  // sort factors by smallest to largest root of the function (-b/a)
  this.factors.sort(function(a,b) {
    if (a.coefficient === b.coefficient && a.constant == b.constant) {
      return 0;
    } else {
      return ((a.constant/a.coefficient) > (b.constant/b.coefficient)) ? -1 : 1; // reverse order of ratios, since roots are additive inverses
    }
  });

  let cmap = Math.pow(2,this.degree); // bitmap for filtering factors for all combinations in multiplication
  let polyCoeffs = Array(this.degree+1); // coefficients in the expanded polynomial (ax^2 + bx + c)
  polyCoeffs.fill(0); // initialize to 0

  // iterate through all combinations of the bitmap (eg. 000 through 111 for degree 3 polynomial)
  // 000 will multiply all 3 leading coefficients;
  // 010 will multiply first and third leading coefficients and constant of second term;
  // 111 will multiply all 3 constants
  for (let i = 0; i < cmap; i++) {
    let prod = 1; // product of this particular combination of terms
    let bitmask = i;
    let idx = 0;
    // place is the degree of the variable that this product is a coefficient of - determined by the number of leading coefficients used (vs constants)
    // replacing 0 leaves a string of all 1s with the length of the number of constants used (const is 1, coeff is 0); subtract from degree of polynomial to find degree of term
    let place = this.degree - i.toString(2).replace(/0/g,"").length;

    // loop through factors
    while (idx < this.degree) {
      let term = (bitmask & 1) ? 'coefficient' : 'constant'; // bitmask determines if we use the coefficient or constant of this factor
      prod *= this.factors[idx][term];
      bitmask >>= 1;  // shift one bit over for the next factor
      idx++;
    }

    // coefficient of each place is the sum of all combinations
    polyCoeffs[place] = polyCoeffs[place] + prod;
  }

  // multiply gcf back in to expanded polynomial
  if (this.gcf > 1) {
    for (let place = 0; place < polyCoeffs.length; place++) {
      polyCoeffs[place] *= this.gcf;
    }
  }

  // build the polynomial/display
  let polynomial = '';
  for (let i = 0; i <= this.degree; i++) {
    if (polyCoeffs[i] != 0) {
      polynomial += (polyCoeffs[i] < 0) ? " &minus; " : (i != 0) ? " + " : ""; // negative sign or plus, but not on leading term
      polynomial += (Math.abs(polyCoeffs[i]) != 1 || i == this.degree) ? Math.abs(polyCoeffs[i]) : ""; // omit coefficient of 1, but not on last (constant) term
      polynomial += (i < this.degree) ? "<var>x</var>" : ""; // add the variable (except on final term)
      polynomial += (this.degree - i > 1) ? "<sup>" + (this.degree - i) + "</sup>" : ""; // add the exponent if necessary
    }
  }

  // build the solution/display
  let solution = '';
  let factorDegree = 1; // track repeated factors
  if (this.gcf > 1) {
    solution += this.gcf; // lead with factored-out gcf
  }
  for (let fc = 0; fc < this.degree; fc++) {
    if ( fc > 0 && this.factors[fc].coefficient == this.factors[fc-1].coefficient && this.factors[fc].constant == this.factors[fc-1].constant) {
      // factor matches previous factor, so just keep track of how many repetitions
      factorDegree++;
    } else {
      solution += (factorDegree > 1) ? "<sup>" + factorDegree + "</sup>": ""; // check if previous factor needs an exponent before starting the new one
      solution += "("; // open factor
      solution += (Math.abs(this.factors[fc].coefficient) > 1) ? Math.abs(this.factors[fc].coefficient) : ""; // coefficients should always be positive (factoring out multiples of -1 from a polynomial is not covered here)
      solution += "<var>x</var>";
      solution += (this.factors[fc].constant < 0) ? " &minus; " : (this.factors[fc].constant != 0) ? " + " : ""; // + or - based on sign of constant; check for 0, but shouldn't be allowed anyway (no (x) term)
      solution += (this.factors[fc].constant != 0) ? Math.abs(this.factors[fc].constant) : ""; // print the constant term; again, 0 shouldn't be allowed
      solution += ")"; // close factor
      factorDegree = 1; // reset, since this was a new factor
    }
  }
  solution += (factorDegree > 1) ? "<sup>" + factorDegree + "</sup>": ""; // degree of final factor

  this.question = polynomial;
  this.answer = solution;
}


/* Page-specific control handlers */
function updateConstSliders() {
  let minSlider = document.getElementById("minConstSlider");
  let maxSlider = document.getElementById("maxConstSlider");
  let min = parseInt(minSlider.value);
  let max = parseInt(maxSlider.value);

  // make sure min is actually smaller
  if (min > max) {
    let tmp = max;
    max = min;
    min = tmp;
    minSlider.value = min;
    maxSlider.value = max;
  }

  Utils.updateSliderValue(minSlider);
  Utils.updateSliderValue(maxSlider);
}

window.addEventListener('load', function() {
  const sliders = ['degree', 'coeff', 'minConst', 'maxConst'];
  try {
    for (let i = 0; i < sliders.length; i++ ) {
      const sliderElement = document.getElementById(sliders[i] + 'Slider');
      if (sliderElement) {
	sliderElement.addEventListener('input', function() {
	  if (sliders[i] == 'minConst' || sliders[i] == 'maxConst') {
	    updateConstSliders();
	  } else {
	    Utils.updateSliderValue(sliderElement);
	  }
	});
      }
    }
  } catch(e) {
    console.log('polynomial.js:addEventListener error: ' + e.message);
  }
});
