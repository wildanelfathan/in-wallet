const NodeEnvironment = require('jest-environment-node').default;

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.global.window = {};
    this.global.self = this.global.window;
    this.global.document = {
      createElement: () => ({
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        setAttribute: () => {},
        getElementsByTagName: () => [],
        createTextNode: () => ({}),
      }),
      createTextNode: () => ({}),
      getElementById: () => null,
      getElementsByTagName: () => [],
      querySelector: () => null,
      querySelectorAll: () => [],
      documentElement: {
        style: {},
      },
      location: {
        href: '',
      },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    this.global.navigator = {
      userAgent: 'node.js',
    };
  }

  async setup() {
    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = CustomEnvironment; 