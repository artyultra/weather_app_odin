// services/state.js

class AppState {
  constructor() {
    this.state = {};
    this.listeners = {};
  }

  setState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    this.notify(key, value, oldValue);
  }

  getState(key) {
    return this.state[key];
  }

  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  notify(key, newValue, oldValue) {
    if (this.listeners[key]) {
      this.listeners[key].forEach((callback) => callback(newValue, oldValue));
    }
  }
}

export { AppState };
