import esbuild from 'esbuild';
import minimist from 'minimist';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
// node dev.js (打包哪个项目 -f 打包什么格式) == argv.slice(2)

const args = minimist(process.argv.slice(2))
const __filename = fileURLToPath(import.meta.url) // 获取文件的绝对路径 file: -> /usr
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const target = args._[0] || 'reactivity' // 打包哪个项目
const format = args.f || 'iife' // 打包什么格式（模块化 cjs esm ... ）

// console.log(target, format);

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const pgk = require(`../packages/${target}/package.json`)

esbuild.context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true,
    platform: "browser",
    sourcemap: true,
    format, //（cjs esm iife） iife 必须给 name
    globalName: pgk.buildOptions?.name
}).then((ctx) => {
    console.log("🥳🥳🥳 start dev");
    return ctx.watch() // 监听入口文件，持续打包
})