import { Utils } from '/assets/js/utils.js';

export class MixedNumber {
  constructor(whole = 0, num = 1, denom = 2) {
    this.whole = whole;
    this.num = num;
    this.denom = denom;
  }
}

// returns a new MixedNumber
MixedNumber.prototype.sum = function(other, simplify = true) {
  let ans = new MixedNumber( this.whole + other.whole, this.num * other.denom + other.num * this.denom, this.denom * other.denom);

  if (simplify) {
    ans.simplify();
  }

  return ans;
}

// adds to this
MixedNumber.prototype.addTo = function(other, simplify = true) {
  this.num = this.num * other.denom + other.num * this.denom;
  this.denom = this.denom * other.denom;
  this.whole = this.whole + other.whole;

  if (simplify) {
    this.simplify();
  }
}

// returns a new MixedNumber (this - other)
MixedNumber.prototype.difference = function(other, simplify = true) {
  let ans = new MixedNumber(this.whole, this.num, this.denom);

  if (this.compare(other) < 0) {
    // this is smaller than other, result will be negative

    // convert to common denominator
    ansNum = other.num * this.denom - this.num * other.denom;
    ansDenom = this.denom * other.denom;
    if (ansNum < 0) {
      // regrouping required
// TODO - not sure this is right
      ansWhole -= 1;
      ansNum += ansDenom;
    }
    ansWhole = other.whole - this.whole;
  } else {
    // this is larger than other, result is positive
// TODO - finish this
  }

  let ans = new MixedNumber();

  if (simplify) {
    ans.simplify();
  }

  return ans;
}

// subtracts from this
MixedNumber.prototype.subtractValue = function(other, simplify = true) {
  this.num = this.num * other.denom - other.num * this.denom;
  this.denom = this.denom * other.denom;
  this.whole = this.whole - other.whole;

  if (simplify) {
    this.simplify();
  }
}

// returns a new MixedNumber
MixedNumber.prototype.product = function(other, simplify = true) {
  // convert both to improper
  // multiply
  let ans = new MixedNumber();
  // simplify
  if (simplify) {
    ans.simplify();
  }
}

// multiplies this
MixedNumber.prototype.multiplyBy = function(other, simplify = true) {
  if (simplify) {
    this.simplify();
  }
}

// returns a new MixedNumber
MixedNumber.prototype.quotient = function(other, simplify = true) {
  // convert both to improper
  // cross-multiply
  let ans = new MixedNumber();
  // simplify
  if (simplify) {
    ans.simplify();
  }
}

// divides this
MixedNumber.prototype.divideBy = function(other, simplify = true) {
  if (simplify) {
    this.simplify();
  }
}

MixedNumber.prototype.getWhole = function() {
  return this.whole;
}

MixedNumber.prototype.getNumerator = function() {
  return this.num;
}

MixedNumber.prototype.getDenominator = function() {
  return this.denom;
}

MixedNumber.prototype.lcd = function(other) {
  return (this.denom * other.denom) / Utils.calculateGCF(this.denom, other.denom);
}

MixedNumber.prototype.simplify = function() {
  this.regroup();
  this.reduce();
}

MixedNumber.prototype.reduce = function() {
  [this.num, this.denom] = Utils.reduce(this.num, this.denom);
}

MixedNumber.prototype.regroup = function() {
  if (this.isImproper()) {
    this.whole += Math.floor(this.num / this.denom);
    this.num = this.num % this.denom;
  }
}

MixedNumber.prototype.isImproper = function() {
  return this.num >= this.denom;
}

/* return -1 if this < other; 0 if equal; 1 if this > other */
MixedNumber.prototype.compare = function(other) {
  // compare whole numbers
  if (this.whole < other.whole) {
    return -1;
  } else if (this.whole > other.whole) {
    return 1;
  }

  // whole numbers are equal, compare fractions
  if (this.num * other.denom < other.num * this.denom) {
    return -1;
  } else if (this.num * other.denom > other.num * this.denom) {
    return 1;
  }
  
  return 0;
}
