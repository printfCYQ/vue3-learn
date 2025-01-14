import minimist from 'minimist';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLPath } from 'url';

// node dev.js (打包哪个项目 -f 打包什么格式) == args.slice(2)

const args = minimist(process.args.slice(2))
const __filename = fileURLPath(import.meta.url) // 获取文件的绝对路径 file: -> /usr
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const target = args[0]._[0] || 'reactivity' // 打包哪个项目
const format = args.f || 'iife' // 打包什么格式（模块化 cjs esm ... ）

console.log(target, format);

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)