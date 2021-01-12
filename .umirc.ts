import { defineConfig } from 'umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'hash',
  },
  locale: {
    default: 'en-US',
    baseNavigator: false,
    title: false,
  },
  antd: false, // antd styles loads via less imports in src/styleLoader.js
})
