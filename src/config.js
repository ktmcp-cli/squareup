import Conf from 'conf';

const config = new Conf({
  projectName: 'ktmcp-squareup',
  schema: {
    accessToken: {
      type: 'string',
      default: ''
    },
    environment: {
      type: 'string',
      default: 'production'
    }
  }
});

export function getConfig(key) {
  return config.get(key);
}

export function setConfig(key, value) {
  config.set(key, value);
}

export function getAllConfig() {
  return config.store;
}

export function clearConfig() {
  config.clear();
}

export function isConfigured() {
  return !!config.get('accessToken');
}

export default config;
