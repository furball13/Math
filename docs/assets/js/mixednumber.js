import { Utils } from '/assets/js/utils.js';

export class MixedNumber {
  constructor(whole = 0, num = 1, denom = 2) {
    this.whole = whole;
    this.num = num;
    this.denom = denom;
  }
}

MixedNumber.prototype.add = function(other, simplify = true) {
  this.num = this.num * other.denom + other.num * this.denom;
  this.denom = this.denom * other.denom;
  this.whole = this.whole + other.whole;

  if (simplify) {
    this.simplify();
  }
}

MixedNumber.prototype.subtract = function(other, simplify = true) {
  this.num = this.num * other.denom - other.num * this.denom;
  this.denom = this.denom * other.denom;
  this.whole = this.whole - other.whole;

  if (simplify) {
    this.simplify();
  }
}

MixedNumber.prototype.multiply = function(other) {
}

MixedNumber.prototype.divide = function(other) {
}

MixedNumber.prototype.ldc = function(other) {
}

MixedNumber.prototype.simplify = function() {
  this.regroup();
  this.reduce();
}

MixedNumber.prototype.reduce = function() {
  var gcd = 1;
  do {
  } while (gcd > 1);
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
