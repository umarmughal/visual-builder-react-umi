import store from 'store'
import qs from 'qs'

const STORED_SETTINGS = (storedSettings) => {
  const settings = {}
  Object.keys(storedSettings).forEach((key) => {
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

export default {
  namespace: 'settings',
  state: {
    ...STORED_SETTINGS({
      // Read docs for available values: https://docs.visualbuilder.cloud
      // VB:REPLACE-START:SETTINGS
      authProvider: 'jwt',
      logo: 'Visual Builder',
      version: 'fluent',
      theme: 'default',
      isSidebarOpen: false,
      isSupportChatOpen: false,
      isMobileView: false,
      isMobileMenuOpen: false,
      isMenuCollapsed: false,
      isPreselectedOpen: false,
      preselectedVariant: 'default',
      menuLayoutType: 'left',
      routerAnimation: 'slide-fadein-up',
      menuColor: 'gray',
      authPagesColor: 'gray',
      isAuthTopbar: true,
      primaryColor: '#4b7cf3',
      leftMenuWidth: 256,
      isMenuUnfixed: false,
      isMenuShadow: false,
      isTopbarFixed: false,
      isTopbarSeparated: false,
      isGrayTopbar: false,
      isContentMaxWidth: false,
      isAppMaxWidth: false,
      isGrayBackground: false,
      isCardShadow: true,
      isSquaredBorders: false,
      isBorderless: false,
      layoutMenu: 'classic',
      layoutTopbar: 'v1',
      layoutBreadcrumbs: 'v1',
      layoutFooter: 'v1',
      flyoutMenuType: 'flyout',
      flyoutMenuColor: 'blue',

      // VB:REPLACE-END:SETTINGS
    }),
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
  },
  effects: {
    *CHANGE_SETTING({ payload: { setting, value } }, { put }) {
      yield store.set(`app.settings.${setting}`, value)
      yield put({
        type: 'SET_STATE',
        payload: {
          [setting]: value,
        },
      })
    },
    *CHANGE_SETTING_BULK({ payload }, { put }) {
      const settings = {}
      Object.keys(payload).forEach((key) => {
        store.set(`app.settings.${key}`, payload[key])
        settings[key] = payload[key]
      })

      yield put({
        type: 'SET_STATE',
        payload: { ...settings },
      })
    },
  },
  subscriptions: {
    setup: ({ dispatch, history }) => {
      // load settings from url on app load
      const changeSettings = (search) => {
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        Object.keys(query).forEach((key) => {
          let value
          switch (query[key]) {
            case 'false':
              value = false
              break
            case 'true':
              value = true
              break
            default:
              value = query[key]
              break
          }
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: key,
              value,
            },
          })
        })
      }
      changeSettings(history.location.search)
      history.listen((params) => {
        const { search } = params
        changeSettings(search)
      })

      // detect isMobileView setting on app load and window resize
      const isMobileView = (load = false) => {
        const currentState = global.window.innerWidth < 768
        const prevState = store.get('app.settings.isMobileView')
        if (currentState !== prevState || load) {
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: 'isMobileView',
              value: currentState,
            },
          })
        }
      }

      // detect viewport width on app load and window resize
      const isMenuToggled = () => {
        const shouldToggle = global.window.innerWidth < 1024
        const prevState = store.get('app.settings.isMenuCollapsed')
        if (shouldToggle || prevState) {
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: 'isMenuCollapsed',
              value: true,
            },
          })
        }
      }

      isMobileView(true)
      isMenuToggled()
      window.addEventListener('resize', () => {
        isMobileView()
        isMenuToggled()
      })
    },
  },
}
