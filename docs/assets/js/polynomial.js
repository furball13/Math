/** Generate a factorable polynomial - returns { question, solution } */
function generate() {
  const COEFF = 0, CONST = 1;
  let factors = [];
  let gcf = 1;

  let degree = parseInt(document.getElementById("degreeSlider").value);
  let maxCoeff = parseInt(document.getElementById("coeffSlider").value);
  let minConst = parseInt(document.getElementById("minConstSlider").value);
  let maxConst = parseInt(document.getElementById("maxConstSlider").value);
  let noGCF = document.getElementById('noGCF').checked;

  // randomly generate factors (ax + b)
  // factors are stored in 2d array - each entry is [a, b]
  for (let i = 0; i < degree; i++) {
    let ce = 0;
    let cn = 0;
    let factor = [];

    do {
      if (noGCF) {
        gcf = 1;
      }
      // randomize a coefficient for the factor (a in (ax + b))
      while (ce == 0) {
	ce = Math.floor(Math.random() * maxCoeff + 1);
      }

      // randomize a constant for the factor (b in (ax + b))
      while (cn == 0) {
	cn = Math.floor(Math.random() * (maxConst - minConst + 1)) + minConst;
      }

      // check for common factors
      for (let i = Math.min(Math.abs(ce), Math.abs(cn)); i > 0; i--) {
	if (ce % i == 0 && cn % i == 0) {
	  ce /= i;
	  cn /= i;
	  gcf *= i;
	}
      }
    } while (noGCF && gcf > 1);

    factor.push(ce);
    factor.push(cn);
    factors.push(factor);
  }

  // sort factors by smallest to largest root of the function (-b/a)
  factors.sort(function(a,b) {
    if (a[COEFF] === b[COEFF] && a[CONST] == b[CONST]) {
      return 0;
    } else {
      return ((a[CONST]/a[COEFF]) > (b[CONST]/b[COEFF])) ? -1 : 1; // reverse order of ratios, since roots are additive inverses
    }
  });

  let cmap = Math.pow(2,degree); // bitmap for filtering factors for all combinations in multiplication
  let polyCoeffs = Array(degree+1); // coefficients in the expanded polynomial (ax^2 + bx + c)
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
    let place = degree - i.toString(2).replace(/0/g,"").length;

    // loop through factors
    while (idx < degree) {
      let term = (bitmask & 1) ? COEFF : CONST; // bitmask determines if we use the coefficient or constant of this factor
      prod *= factors[idx][term];
      bitmask >>= 1;  // shift one bit over for the next factor
      idx++;
    }

    // coefficient of each place is the sum of all combinations
    polyCoeffs[place] = polyCoeffs[place] + prod;
  }

  // multiply gcf back in to expanded polynomial
  if (gcf > 1) {
    for (let place = 0; place < polyCoeffs.length; place++) {
      polyCoeffs[place] *= gcf;
    }
  }

  // build the polynomial/display
  let polynomial = "<p id=\"polynomial\">";
  for (let i = 0; i <= degree; i++) {
    if (polyCoeffs[i] != 0) {
      polynomial += (polyCoeffs[i] < 0) ? " &minus; " : (i != 0) ? " + " : ""; // negative sign or plus, but not on leading term
      polynomial += (Math.abs(polyCoeffs[i]) != 1 || i == degree) ? Math.abs(polyCoeffs[i]) : ""; // omit coefficient of 1, but not on last (constant) term
      polynomial += (i < degree) ? "<var>x</var>" : ""; // add the variable (except on final term)
      polynomial += (degree - i > 1) ? "<sup>" + (degree - i) + "</sup>" : ""; // add the exponent if necessary
    }
  }

  // build the solution/display
  let solution = "<p>";
  let factorDegree = 1; // track repeated factors
  if (gcf > 1) {
    solution += gcf; // lead with factored-out gcf
  }
  for (let fc = 0; fc < degree; fc++) {
    if ( fc > 0 && factors[fc][COEFF] == factors[fc-1][COEFF] && factors[fc][CONST] == factors[fc-1][CONST]) {
      // factor matches previous factor, so just keep track of how many repetitions
      factorDegree++;
    } else {
      solution += (factorDegree > 1) ? "<sup>" + factorDegree + "</sup>": ""; // check if previous factor needs an exponent before starting the new one
      solution += "("; // open factor
      solution += (Math.abs(factors[fc][COEFF]) > 1) ? Math.abs(factors[fc][COEFF]) : ""; // coefficients should always be positive (factoring out multiples of -1 from a polynomial is not covered here)
      solution += "<var>x</var>";
      solution += (factors[fc][CONST] < 0) ? " &minus; " : (factors[fc][CONST] != 0) ? " + " : ""; // + or - based on sign of constant; check for 0, but shouldn't be allowed anyway (no (x) term)
      solution += (factors[fc][CONST] != 0) ? Math.abs(factors[fc][CONST]) : ""; // print the constant term; again, 0 shouldn't be allowed
      solution += ")"; // close factor
      factorDegree = 1; // reset, since this was a new factor
    }
  }
  solution += (factorDegree > 1) ? "<sup>" + factorDegree + "</sup>": "";

  document.getElementById("result").innerHTML = polynomial + "</p><p><button onclick=\"showSolution()\">Show Solution</button></p>";
  document.getElementById("solution").style.display = "none";
  document.getElementById("solution").innerHTML = solution;
}

function showSolution()
{
	document.getElementById("solution").style.display = "block";
}

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

  document.getElementById("minConstValue").innerHTML = min;
  document.getElementById("maxConstValue").innerHTML = max;
}

window.addEventListener('load', function() {
  document.getElementById("degreeSlider").oninput = function() { document.getElementById("degreeValue").innerHTML = this.value; }
  document.getElementById("coeffSlider").oninput = function() { document.getElementById("coeffValue").innerHTML = this.value; }
  document.getElementById("minConstSlider").oninput = updateConstSliders;
  document.getElementById("maxConstSlider").oninput = updateConstSliders;
});
