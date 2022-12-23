class JobNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JobNotFoundError';
    this.status = 404;
  }
}

class ProfileIsNotClientError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProfileIsNotClientError';
    this.status = 400;
  }
}

class ProfileIsNotJobClient extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProfileIsNotJobClient';
    this.status = 400;
  }
}

class JobAlreadyPaidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JobAlreadyPaidError';
    this.status = 400;
  }
}

module.exports = { JobNotFoundError, ProfileIsNotClientError, ProfileIsNotJobClient, JobAlreadyPaidError };