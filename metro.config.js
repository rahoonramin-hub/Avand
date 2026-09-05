// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// فایل‌های dotLottie/Lottie (.lottie) باید به‌عنوان asset شناخته بشن
// تا Metro بتونه require/import شون کنه.
config.resolver.assetExts.push('lottie');

module.exports = config;