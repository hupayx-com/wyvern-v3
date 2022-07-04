const fs = require('fs')

const getConfig = () => {
  return JSON.parse(fs.readFileSync('config.json'))
}

const getConfigValue = (param1, param2) => {
  return JSON.parse(fs.readFileSync('config.json')).deployed[param1][param2];
}

const updateConfig = (func) => {
  const previous = getConfig()
  const updated = func(previous)
  fs.writeFileSync('config.json', JSON.stringify(updated, null, 2))
}

const setConfig = (path, val) => {
  path = path.split('.').reverse()
  updateConfig(config => {
    var ref = config
    while (path.length > 1) {
      const key = path.pop()
      if (!ref[key]) ref[key] = {}
      ref = ref[key]
    }
    ref[path.pop()] = val
    return config
  })
}

module.exports = {
  getConfig,
  getConfigValue,
  setConfig,
  updateConfig
}
