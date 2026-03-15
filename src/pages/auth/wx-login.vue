<template>
    <view class="wx-login-page">
        <view class="login-section">
            <view class="logo-section">
                <image src="/static/icon/home.png" class="logo" mode="aspectFit"></image>
                <text class="app-name">匠心面坊</text>
                <text class="app-desc">微信授权登录</text>
            </view>

            <view class="auth-buttons">
                <button 
                    class="auth-btn primary-btn" 
                    open-type="getUserInfo" 
                    @getuserinfo="handleGetUserInfo"
                    v-if="!userInfo"
                >
                    <text class="btn-text">微信一键登录</text>
                </button>

                <button 
                    class="auth-btn phone-btn" 
                    @click="showPhoneLogin"
                >
                    <text class="btn-text">手机号登录</text>
                </button>
            </view>

            <view class="user-info" v-if="userInfo">
                <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill"></image>
                <text class="nickname">{{userInfo.nickName}}</text>
                <text class="welcome-text">欢迎回来</text>
                <button class="enter-btn" @click="goToHome">进入首页</button>
            </view>

            <view class="phone-login-section" v-if="showPhoneForm">
                <view class="form-item">
                    <label class="form-label">手机号</label>
                    <input 
                        class="form-input" 
                        type="number" 
                        v-model="phoneForm.phone" 
                        placeholder="请输入手机号" 
                        maxlength="11" 
                    />
                </view>
                <view class="form-item">
                    <label class="form-label">验证码</label>
                    <view class="code-input-group">
                        <input 
                            class="form-input code-input" 
                            type="number" 
                            v-model="phoneForm.code" 
                            placeholder="请输入验证码" 
                            maxlength="6" 
                        />
                        <button 
                            class="code-btn" 
                            :disabled="codeTimer > 0" 
                            @click="sendCode"
                        >
                            {{codeTimerText}}
                        </button>
                    </view>
                </view>
                <button class="submit-btn" @click="handlePhoneLogin">登录</button>
                <view class="back-btn" @click="showPhoneForm = false">返回微信登录</view>
            </view>
        </view>
    </view>
</template>

<script>
import { saveUser, showToast } from '../../common/util.js';

export default {
    data() {
        return {
            userInfo: null,
            showPhoneForm: false,
            phoneForm: {
                phone: '',
                code: ''
            },
            codeTimer: 0,
            codeTimerText: '获取验证码'
        };
    },
    onLoad() {
        this.checkLoginStatus();
    },
    methods: {
        checkLoginStatus() {
            const user = uni.getStorageSync('noodle_user');
            if (user) {
                this.userInfo = {
                    nickName: user.name,
                    avatarUrl: 'https://modao.cc/agent-py/media/generated_images/2026-02-12/ec07a702deb64c16a994f4b5823012b5.jpg'
                };
            }
        },
        handleGetUserInfo(e) {
            console.log('获取用户信息:', e);
            if (e.detail.errMsg === 'getUserInfo:ok') {
                const { nickName, avatarUrl, encryptedData, iv } = e.detail.userInfo;
                
                this.userInfo = { nickName, avatarUrl };
                
                const user = {
                    name: nickName,
                    phone: 'wx_' + Date.now(),
                    avatar: avatarUrl,
                    encryptedData,
                    iv
                };
                
                saveUser(user);
                showToast('登录成功');
                
                setTimeout(() => {
                    uni.switchTab({
                        url: '/pages/user/home/home'
                    });
                }, 1500);
            } else {
                showToast('获取用户信息失败');
            }
        },
        showPhoneLogin() {
            this.showPhoneForm = true;
        },
        sendCode() {
            if (!this.phoneForm.phone) {
                showToast('请输入手机号');
                return;
            }
            
            if (!/^1[3-9]\d{9}$/.test(this.phoneForm.phone)) {
                showToast('请输入正确的手机号');
                return;
            }
            
            showToast('验证码已发送');
            this.startCodeTimer();
        },
        startCodeTimer() {
            this.codeTimer = 60;
            this.codeTimerText = '60s';
            
            const timer = setInterval(() => {
                this.codeTimer--;
                if (this.codeTimer <= 0) {
                    clearInterval(timer);
                    this.codeTimerText = '获取验证码';
                } else {
                    this.codeTimerText = this.codeTimer + 's';
                }
            }, 1000);
        },
        handlePhoneLogin() {
            const { phone, code } = this.phoneForm;
            
            if (!phone || !code) {
                showToast('请填写手机号和验证码');
                return;
            }
            
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                showToast('请输入正确的手机号');
                return;
            }
            
            if (code.length !== 6) {
                showToast('请输入6位验证码');
                return;
            }
            
            const user = {
                name: '微信用户',
                phone: phone,
                avatar: 'https://modao.cc/agent-py/media/generated_images/2026-02-12/ec07a702deb64c16a994f4b5823012b5.jpg'
            };
            
            saveUser(user);
            showToast('登录成功');
            
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/user/home/home'
                });
            }, 1500);
        },
        goToHome() {
            uni.switchTab({
                url: '/pages/user/home/home'
            });
        }
    }
};
</script>

<style scoped>
.wx-login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #FACC15 0%, #F97316 100%);
    padding: 80rpx 40rpx 40rpx;
}

.login-section {
    background: #FFFFFF;
    border-radius: 32rpx;
    padding: 60rpx 40rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;
}

.logo {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-bottom: 24rpx;
}

.app-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #111827;
    margin-bottom: 8rpx;
}

.app-desc {
    font-size: 24rpx;
    color: #6B7280;
}

.auth-buttons {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.auth-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.primary-btn {
    background: linear-gradient(to right, #FACC15, #F97316);
    color: #FFFFFF;
}

.phone-btn {
    background: #FFFFFF;
    color: #F97316;
    border: 2rpx solid #FACC15;
}

.btn-text {
    font-size: 28rpx;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0;
}

.avatar {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
    margin-bottom: 24rpx;
}

.nickname {
    font-size: 32rpx;
    font-weight: bold;
    color: #111827;
    margin-bottom: 8rpx;
}

.welcome-text {
    font-size: 24rpx;
    color: #6B7280;
    margin-bottom: 32rpx;
}

.enter-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #FACC15;
    color: #FFFFFF;
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;
}

.phone-login-section {
    margin-top: 40rpx;
}

.form-item {
    margin-bottom: 32rpx;
}

.form-label {
    font-size: 24rpx;
    color: #6B7280;
    margin-bottom: 16rpx;
    display: block;
}

.form-input {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    padding: 0 24rpx;
    border: 2rpx solid #E5E7EB;
    border-radius: 16rpx;
    font-size: 28rpx;
    box-sizing: border-box;
}

.code-input-group {
    display: flex;
    gap: 16rpx;
}

.code-input {
    flex: 1;
}

.code-btn {
    width: 200rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: #FACC15;
    color: #FFFFFF;
    border-radius: 16rpx;
    font-size: 24rpx;
    border: none;
}

.code-btn[disabled] {
    background: #9CA3AF;
}

.submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #FACC15;
    color: #FFFFFF;
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;
}

.back-btn {
    text-align: center;
    font-size: 24rpx;
    color: #6B7280;
    margin-top: 24rpx;
    padding: 16rpx;
}
</style>