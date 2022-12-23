class SelfDepositError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SelfDepositError';
    this.status = 400;
  }
};

class AmountBiggerThanRatioError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AmountBiggerThanRatioError';
    this.status = 400;
  }
};

module.exports = { SelfDepositError, AmountBiggerThanRatioError };