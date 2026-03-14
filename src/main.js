import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
    const app = createSSRApp(App)
    
    // 全局挂载工具方法
    app.config.globalProperties.$showToast = (title, icon = 'none') => {
        uni.showToast({
            title,
            icon,
            duration: 1500
        })
    }
    
    return {
        app
    }
}
