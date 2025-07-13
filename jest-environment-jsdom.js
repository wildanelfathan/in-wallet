const JSDOMEnvironment = require('jest-environment-jsdom').default;

class CustomEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
    this.global.window = undefined;
  }

  async setup() {
    await super.setup();
    this.global.window = this.global.window || {};
  }
}

module.exports = CustomEnvironment; 