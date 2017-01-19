const NodeCache = require ('node-cache');

class KVStore {
  constructor(configuration) {
    this.configuration = configuration || {};
  }

  put(key, value) {
    throw new Error (`KVStore used directly for put(${key}, ${value})`);
  }

  get(key) {
    throw new Error (`KVStore used directly for get(${key})`);
  }
}

class NodeCacheStore extends KVStore {
  constructor(k) {
    super (k);
    const config = {
      stdTTL: this.configuration.stdTTL || 0,
      checkperiod: this.configuration.checkPeriod || 600,
      errorOnMissing: this.configuration.errorOnMissing || false,
      useClones: this.configuration.useClone || true
    };
    this.cache   = new NodeCache (config);
  }

  put(key, value) {
    this.cache.set (key, value);
  }

  get(key) {
    return this.cache.get (key);
  }
}
