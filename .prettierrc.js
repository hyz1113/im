module.exports = {
    // 行的字符数，如果超过会进行换行
    printWidth: 120,
    // 使用 4 个空格缩进
    tabWidth: 4,
    // 不使用缩进符，而使用空格
    useTabs: false,
    // 句尾添加分号
    semi: true,
    // 字符串是否使用单引号，默认为false，使用双引号
    singleQuote: true,
    // 对象属性的引号使用:as-needed 按需添加,consistent一致原则，即对象中若有一个属性添加了引号，其他所有属性都添加,preserve 保留用户输入的情况
    quoteProps: 'preserve',
    // 在JSX中使用单引号而不是双引号
    jsxSingleQuote: false,
    // 多行时尽可能打印尾随逗号。（例如，单行数组永远不会出现逗号结尾。） 可选值"<none|es5|all>"，默认none
    trailingComma: 'es5',
    // 在对象文字中的括号之间打印空格
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    arrowParens: 'avoid', // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
    // 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
    rangeStart: 0,
    rangeEnd: Infinity,
    // 指定要使用的解析器，不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准 always\never\preserve
    proseWrap: 'never',
    // 指定HTML文件的全局空格敏感度 css\strict\ignore
    htmlWhitespaceSensitivity: 'css',
    // Vue文件脚本和样式标签缩进
    vueIndentScriptAndStyle: false,
    // 换行符使用 lf 结尾是 \n \r \n\r auto 可选值"<auto|lf|crlf|cr>"
    endOfLine: 'lf',
};
