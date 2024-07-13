import { Utils } from '/assets/js/utils.js';

/** Problem Class **/
/** generic problem - extend in each problem type */
export class Problem {
  constructor(params) {
    this.params = params;
    this.question = '';
    this.answer = '';
  }

  /** placeholder function - override in each problem type */
  generate() {
    // reset for new question
    this.question = '';
    this.answer = '';
  }

  getQuestion() {
    return this.question;
  }

  getAnswer() {
    return this.answer;
  }

  toString() {
    let response = [];

    response.push(this.question, '=', this.answer);

    return response.join(' ');
  }
}
