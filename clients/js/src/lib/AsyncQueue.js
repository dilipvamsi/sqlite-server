/**
 * @file lib/AsyncQueue.js
 * @class AsyncQueue
 * @description A generic FIFO queue that implements the AsyncIterator protocol.
 * Used to turn gRPC Stream events ('data') into awaitable yields.
 */
class AsyncQueue {
  constructor() {
    /** @type {any[]} Internal buffer of items received but not yet requested. */
    this.queue = [];
    /** @type {Function[]} Waiting resolvers (pull requests). */
    this.resolvers = [];
    this.closed = false;
    this.error = null;
  }

  /**
   * Pushes a new item into the queue.
   * If there is a pending listener (await next()), it resolves immediately.
   * @param {any} value
   */
  push(value) {
    if (this.closed) return;
    if (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      resolve({ value, done: false });
    } else {
      this.queue.push(value);
    }
  }

  /**
   * Marks the queue as finished (EOF).
   * Resolves all pending listeners with done: true.
   */
  close() {
    this.closed = true;
    while (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      resolve({ value: undefined, done: true });
    }
  }

  /**
   * Marks the queue as failed.
   * Rejects all pending listeners.
   * @param {Error} err
   */
  fail(err) {
    this.error = err;
    this.closed = true;
    while (this.resolvers.length > 0) {
      const resolver = this.resolvers.shift();
      // We attached the reject function to the resolver object in next()
      resolver.reject(err);
    }
  }

  /**
   * The Iterator protocol next() method.
   * @returns {Promise<{value: any, done: boolean}>}
   */
  next() {
    if (this.queue.length > 0) {
      return Promise.resolve({ value: this.queue.shift(), done: false });
    }
    if (this.closed) {
      if (this.error) return Promise.reject(this.error);
      return Promise.resolve({ value: undefined, done: true });
    }

    return new Promise((resolve, reject) => {
      // Attach reject to the resolve function so fail() can find it
      resolve.reject = reject;
      this.resolvers.push(resolve);
    });
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

module.exports = AsyncQueue;
