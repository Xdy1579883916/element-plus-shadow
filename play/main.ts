import { createApp } from 'vue'
import '@element-plus/theme-chalk/src/dark/css-vars.scss'
import '@element-plus/theme-chalk/src/notification.scss'
import '@element-plus/theme-chalk/src/message-box.scss'
import '@element-plus/theme-chalk/src/message.scss'
;(async () => {
  const apps = import.meta.glob('./src/*.vue')
  const name = location.pathname.replace(/^\//, '') || 'App'
  const file = apps[`./src/${name}.vue`]
  if (!file) {
    location.pathname = 'App'
    return
  }
  const App = (await file()).default
  const app = createApp(App)

  const container = document.querySelector('#play')!
  const shadowDOM = container.attachShadow?.({ mode: 'open' }) || container
  const root = document.createElement('div')
  shadowDOM.appendChild(root)
  app.provide('appRoot', root)
  app.mount(root)

  const app2 = createApp(App)
  const root2 = document.createElement('div')
  shadowDOM.appendChild(root2)
  app2.provide('appRoot', root2)
  app2.mount(root2)

  // const app3 = createApp(App)
  // app3.mount('#app3')
})()
