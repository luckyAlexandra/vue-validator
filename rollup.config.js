// import json from 'rollup-plugin-json';

//  rollup-plugin-node-resolve 和 rollup-plugin-commonjs 。这两个插件可以让你加载Node.js里面的CommonJS模块
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// 使用 [rollup-plugin-babel]
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

export default {
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'esm',
    name: 'vue-validator'
  },
  plugins: [ 
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.NODE_ENV === "production" && uglify()
  ]
}