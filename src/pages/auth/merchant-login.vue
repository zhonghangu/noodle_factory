<template>
    <view class="merchant-login-page">
        <view class="header">
            <text class="title">商家登录</text>
            <text class="subtitle">欢迎回来，管理您的店铺</text>
        </view>

        <view class="form-section">
            <view class="form-item">
                <text class="label">账号</text>
                <input 
                    class="input" 
                    type="text" 
                    v-model="form.username" 
                    placeholder="请输入商家账号"
                    maxlength="20"
                />
            </view>

            <view class="form-item">
                <text class="label">密码</text>
                <input 
                    class="input" 
                    type="password" 
                    v-model="form.password" 
                    placeholder="请输入密码"
                    maxlength="20"
                />
            </view>

            <view class="form-tips">
                <text class="link" @click="goToRegister">还没有商家账号？立即入驻</text>
            </view>

            <button class="login-btn" @click="handleLogin">登录</button>
        </view>

        <view class="footer">
            <text class="footer-text">登录即表示您同意《商家服务协议》</text>
        </view>
    </view>
</template>

<script>
import { saveMerchant, showToast } from '../../common/util.js'

export default {
    data() {
        return {
            form: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        handleLogin() {
            const { username, password } = this.form
            if (!username || !password) {
                showToast('请输入账号和密码')
                return
            }

            // 模拟登录，实际对接后端接口
            if (username === 'admin' && password === '123456') {
                const merchant = {
                    id: 1,
                    name: '匠心面坊总店',
                    username: 'admin',
                    avatar: '/static/merchant-avatar.png'
                }
                saveMerchant(merchant)
                uni.switchTab({
                    url: '/pages/merchant/dashboard/dashboard'
                })
                showToast('登录成功')
            } else {
                showToast('账号或密码错误')
            }
        },
        goToRegister() {
            uni.navigateTo({
                url: '/pages/auth/merchant-register'
            })
        }
    }
}
</script>

<style scoped lang="scss">
.merchant-login-page {
    min-height: 100vh;
    background-color: $gray-100;
    padding: 80rpx 40rpx 40rpx;
}

.header {
    margin-bottom: 80rpx;

    .title {
        font-size: 48rpx;
        font-weight: bold;
        color: $gray-800;
        display: block;
        margin-bottom: 16rpx;
    }

    .subtitle {
        font-size: 28rpx;
        color: $gray-500;
    }
}

.form-section {
    .form-item {
        margin-bottom: 40rpx;

        .label {
            font-size: 28rpx;
            color: $gray-600;
            display: block;
            margin-bottom: 16rpx;
        }

        .input {
            width: 100%;
            height: 88rpx;
            background: #fff;
            border: 2rpx solid $gray-200;
            border-radius: 16rpx;
            padding: 0 24rpx;
            font-size: 28rpx;
            box-sizing: border-box;

            &:focus {
                border-color: $primary-color;
            }
        }
    }

    .form-tips {
        text-align: right;
        margin-bottom: 60rpx;

        .link {
            font-size: 24rpx;
            color: $primary-color;
        }
    }

    .login-btn {
        width: 100%;
        height: 88rpx;
        background: $primary-color;
        color: #fff;
        border: none;
        border-radius: 16rpx;
        font-size: 32rpx;
        font-weight: bold;
    }
}

.footer {
    position: fixed;
    bottom: 40rpx;
    left: 0;
    right: 0;
    text-align: center;

    .footer-text {
        font-size: 24rpx;
        color: $gray-400;
    }
}
</style>
