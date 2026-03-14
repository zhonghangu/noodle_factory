// 验证脚本 - 检查项目修复情况

console.log('=== 匠心面坊项目验证报告 ===\n');

// 检查文件结构
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

// 1. 检查 package.json
console.log('1. 检查项目配置文件:');
const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    console.log('   ✅ package.json 存在');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('   📦 项目名称:', packageJson.name);
    console.log('   📋 脚本命令:', Object.keys(packageJson.scripts || {}));
} else {
    console.log('   ❌ package.json 缺失');
}

// 2. 检查 App.vue 修复
console.log('\n2. 检查 App.vue 修复:');
const appVuePath = path.join(projectRoot, 'App.vue');
if (fs.existsSync(appVuePath)) {
    const appVueContent = fs.readFileSync(appVuePath, 'utf8');
    if (!appVueContent.includes('router-view')) {
        console.log('   ✅ 已移除 router-view');
    } else {
        console.log('   ❌ 仍存在 router-view');
    }
    if (appVueContent.includes('setTimeout')) {
        console.log('   ✅ 已添加 setTimeout 延迟');
    } else {
        console.log('   ❌ 未添加 setTimeout 延迟');
    }
    if (appVueContent.includes('noodle_user')) {
        console.log('   ✅ 已修正本地存储键名');
    } else {
        console.log('   ❌ 本地存储键名未修正');
    }
} else {
    console.log('   ❌ App.vue 缺失');
}

// 3. 检查 pages.json 修复
console.log('\n3. 检查 pages.json 修复:');
const pagesJsonPath = path.join(projectRoot, 'pages.json');
if (fs.existsSync(pagesJsonPath)) {
    const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));
    if (pagesJson.tabBar && pagesJson.tabBar.height === '80rpx') {
        console.log('   ✅ tabBar 高度已修正为 rpx 单位');
    } else {
        console.log('   ❌ tabBar 高度未修正');
    }
} else {
    console.log('   ❌ pages.json 缺失');
}

// 4. 检查 util.js 修复
console.log('\n4. 检查 util.js 修复:');
const utilJsPath = path.join(projectRoot, 'common', 'util.js');
if (fs.existsSync(utilJsPath)) {
    const utilJsContent = fs.readFileSync(utilJsPath, 'utf8');
    if (utilJsContent.includes('encryptPassword')) {
        console.log('   ✅ 已添加密码加密功能');
    } else {
        console.log('   ❌ 未添加密码加密功能');
    }
    if (utilJsContent.includes('decryptPassword')) {
        console.log('   ✅ 已添加密码解密功能');
    } else {
        console.log('   ❌ 未添加密码解密功能');
    }
} else {
    console.log('   ❌ util.js 缺失');
}

// 5. 检查导入路径修复
console.log('\n5. 检查导入路径修复:');
const userPages = ['home', 'profile', 'order'];
let pathFixCount = 0;
let pathErrorCount = 0;

userPages.forEach(page => {
    const pagePath = path.join(projectRoot, 'pages', 'user', page, `${page}.vue`);
    if (fs.existsSync(pagePath)) {
        const pageContent = fs.readFileSync(pagePath, 'utf8');
        if (pageContent.includes('../../../common/')) {
            console.log(`   ✅ ${page}.vue 导入路径已修复`);
            pathFixCount++;
        } else {
            console.log(`   ❌ ${page}.vue 导入路径未修复`);
            pathErrorCount++;
        }
    }
});

// 6. 检查 auth 页面导入路径
const authPages = ['merchant-login', 'identity-select'];
authPages.forEach(page => {
    const pagePath = path.join(projectRoot, 'pages', 'auth', `${page}.vue`);
    if (fs.existsSync(pagePath)) {
        const pageContent = fs.readFileSync(pagePath, 'utf8');
        if (pageContent.includes('../../common/')) {
            console.log(`   ✅ ${page}.vue 导入路径正确`);
            pathFixCount++;
        } else {
            console.log(`   ❌ ${page}.vue 导入路径错误`);
            pathErrorCount++;
        }
    }
});

// 7. 检查组件命名规范
console.log('\n6. 检查组件命名规范:');
const componentsPath = path.join(projectRoot, 'components');
if (fs.existsSync(componentsPath)) {
    const components = fs.readdirSync(componentsPath);
    components.forEach(component => {
        if (fs.statSync(path.join(componentsPath, component)).isDirectory()) {
            const componentFiles = fs.readdirSync(path.join(componentsPath, component));
            const hasVueFile = componentFiles.some(file => file.endsWith('.vue'));
            if (hasVueFile) {
                console.log(`   ✅ 组件 ${component} 结构规范`);
            }
        }
    });
} else {
    console.log('   ❌ components 目录缺失');
}

// 8. 检查静态资源
console.log('\n7. 检查静态资源:');
const staticPath = path.join(projectRoot, 'static');
if (fs.existsSync(staticPath)) {
    console.log('   ✅ static 目录存在');
    const iconPath = path.join(staticPath, 'icon');
    if (fs.existsSync(iconPath)) {
        console.log('   ✅ icon 目录存在');
        const icons = fs.readdirSync(iconPath);
        console.log(`   📁 图标文件数量: ${icons.length}`);
    } else {
        console.log('   ❌ icon 目录缺失');
    }
} else {
    console.log('   ❌ static 目录缺失');
}

console.log('\n=== 验证完成 ===');
console.log(`修复的问题: ${pathFixCount}`);
console.log(`仍存在的问题: ${pathErrorCount}`);
