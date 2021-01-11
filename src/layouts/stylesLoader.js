import { useEffect } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ settings: { version, theme, primaryColor } }) => ({
  version,
  theme,
  primaryColor,
})

let isLoaded = false

const StylesLoader = ({ dispatch, children, version, theme, primaryColor }) => {
  // listen & set vb-version (pro, air, fluent, ...)
  useEffect(() => {
    document.querySelector('html').setAttribute('data-vb-version', version)
  }, [version])

  // listen & set vb-theme (dark, default, ...)
  useEffect(() => {
    document.querySelector('html').setAttribute('data-vb-theme', theme)
    dispatch({
      type: 'settings/SET_THEME',
      payload: {
        theme,
      },
    })
    if (isLoaded) {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'menuColor',
          value: theme === 'dark' ? 'dark' : 'white',
        },
      })
    }
    isLoaded = true
  }, [theme, dispatch])

  // listen & set primaryColor
  useEffect(() => {
    const styleElement = document.querySelector('#primaryColor')
    if (styleElement) {
      styleElement.remove()
    }
    const body = document.querySelector('body')
    const styleEl = document.createElement('style')
    const css = document.createTextNode(`:root { --vb-color-primary: ${primaryColor};}`)
    styleEl.setAttribute('id', 'primaryColor')
    styleEl.appendChild(css)
    body.appendChild(styleEl)
  }, [primaryColor])

  return children
}

export default connect(mapStateToProps)(StylesLoader)
