const { REPLACE_NEXT_LINE, REPLACE_BETWEEN } = require('../utils/io')

const routerFile = 'src/pages/index.js'

const routeTpl = (route) => `{
  path: '${route.url}',
  Component: lazy(() => import('pages${route.url}')),
  exact: true,
},\n`

module.exports = (config) => {
  // find redirectTo
  let redirectTo
  config.forEach((item) => {
    if (item.category || item.url === '/auth') {
      return
    }
    if (!redirectTo) {
      redirectTo = process.env.REDIRECT_URL || item.url
    }
  })

  // replace redirectTo
  REPLACE_NEXT_LINE(
    routerFile,
    `VB:REPLACE-NEXT-LINE:ROUTER-REDIRECT`,
    `return <Redirect to="${redirectTo}" />`,
  )
}
