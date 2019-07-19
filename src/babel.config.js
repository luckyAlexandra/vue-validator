// 首先，我们设置"modules": false，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS，导致 Rollup 的一些处理失败。
// 其次，我们使用external-helpers插件，它允许 Rollup 在包的顶部只引用一次 “helpers”，而不是每个使用它们的模块中都引用一遍（这是默认行为）。
// 第三，我们将.babelrc文件放在src中，而不是根目录下。 这允许我们对于不同的任务有不同的.babelrc配置，比如像测试，如果我们以后需要的话 - 通常为单独的任务单独配置会更好。
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
];

const plugins = [
  ["external-helpers"]
]

module.exports = { presets, plugins };