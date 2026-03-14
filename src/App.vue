<template>
    <view id="app">
        <view class="app-container">
            <!-- 应用内容将通过 pages.json 配置的页面自动渲染 -->
        </view>
    </view>
</template>

<script>
export default {
    onLaunch: function() {
        console.log('App Launch')
        // 检查登录状态，自动跳转
        const user = uni.getStorageSync('noodle_user')
        const merchant = uni.getStorageSync('merchant')
        
        // 延迟执行，确保页面栈初始化
        setTimeout(() => {
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]?.route
            
            // 如果不是身份选择页，且没有登录信息，跳转到身份选择
            if (!currentPage?.includes('pages/auth/') && !user && !merchant) {
                uni.reLaunch({
                    url: '/pages/auth/identity-select'
                })
            }
        }, 100)
    },
    onShow: function() {
        console.log('App Show')
    },
    onHide: function() {
        console.log('App Hide')
    },
    globalData: {
        userInfo: null,
        merchantInfo: null
    }
}
</script>

<style>
/* 全局样式 */

page {
    background-color: #F3F4F6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 通用间距 */
.mt-10 { margin-top: 10rpx; }
.mt-20 { margin-top: 20rpx; }
.mt-30 { margin-top: 30rpx; }
.mb-10 { margin-bottom: 10rpx; }
.mb-20 { margin-bottom: 20rpx; }
.mb-30 { margin-bottom: 30rpx; }
.p-10 { padding: 10rpx; }
.p-20 { padding: 20rpx; }
.p-30 { padding: 30rpx; }

/* 通用flex布局 */
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-column { display: flex; flex-direction: column; }

/* 圆角 */
.radius-8 { border-radius: 8rpx; }
.radius-12 { border-radius: 12rpx; }
.radius-16 { border-radius: 16rpx; }

/* 文字 */
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-gray { color: #9CA3AF; }
.text-primary { color: #FACC15; }
.text-sm { font-size: 24rpx; }
.text-base { font-size: 28rpx; }
.text-lg { font-size: 32rpx; }
.font-bold { font-weight: bold; }
</style>
