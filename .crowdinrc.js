module.exports = {
    base: require('path').resolve(__dirname, './'), // 项目根目录
    keys: './src/locales/source/', // 语言源目录
    project: 'CrmMgt', // 项目名
    apiKey: '7497bea3a0c141ffb2e431c1ee747f3a', // token key  2351289e5ce5b0ff38b1390e06b2da50
    output: './src/locales/json/', // 语言包输出目录
    prefix: 'keys', // 语言源文件命名前缀
    pattern: /^P_[a-zA-Z0-9-_]+:/, // 语言源文件中别名的命名规则
    fileTypes: [".ejs", ".html",'.vue','.js'],
    sourceLanguage: 'zh-CN',
    languageMap: {
        "en-us": {
            "crowdin": "en",
            "sogou": "en",
            "LANG": "en-us",
            "LANG_CODE": "en",
            "LANG_AREA": "us",
        },
        "zh-cn": {
            "crowdin": "zh-CN",
            "sogou": "zh-CNS",
            "LANG": "zh-cn",
            "LANG_CODE": "zh",
            "LANG_AREA": "cn",
        },
    },
};
