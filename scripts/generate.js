const path = require('path')
const fs = require('fs')

const logg = require('./utils/logg')
const { GENERATE_MENU, GENERATE_SETTINGS, GENERATE_PAGES } = require('./generators')

const generateMenu = (config) => {
  logg('Processing menu config...', 'clean', ' ├─ ')
  if (!config) {
    logg('❎ Skipping... Not found in config file.', 'clean', ' │  ')
    return
  }
  GENERATE_MENU(config)
  logg('✅ Done...', 'clean', ' │  ')
}

const generateSettings = (settings) => {
  logg('Processing app settings...', 'clean', ' ├─ ')
  if (!settings) {
    logg('❎ Skipping... Not found in config file', 'clean', ' │  ')
    return
  }
  GENERATE_SETTINGS(settings)
  logg('✅ Done...', 'clean', ' │  ')
}

const generatePages = (config, content) => {
  logg('Processing pages...', 'clean', ' └─ ')
  if (!content) {
    logg('❎ Skipping... Not found in config file.', 'clean', ' │  ')
    return
  }
  GENERATE_PAGES(config, content)
  logg('✅ Done...', 'clean', '    ')
}

const generate = (filepath) => {
  try {
    const { vb, config, content, settings } = JSON.parse(fs.readFileSync(filepath))
    if (!vb) {
      logg('Wrong config file. Try to use another one.', 'red')
      return
    }
    generateMenu(config)
    generateSettings(settings)
    // generatePages(config, content)
  } catch (err) {
    console.log(err)
    logg(
      'Something goes wrong. Try to change config file or checkout latest version from git.',
      'red',
    )
  }
}

if (process.argv[2] && process.argv[2].startsWith('--config=')) {
  const resolvedPath = path.resolve(__dirname, process.argv[2].replace('--config=', ''))
  if (!fs.existsSync(resolvedPath)) {
    logg('Config file not found: ' + resolvedPath, 'red')
    return
  }
  logg('Run generator...', 'green')
  logg('Config: ' + resolvedPath, 'green')
  generate(resolvedPath)
}

module.exports = generate
