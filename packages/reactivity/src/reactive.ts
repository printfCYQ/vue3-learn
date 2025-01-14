import { isObject } from '@vue/shared';
import { mutableHandlers, ReactiveFlags } from './baseHandler';


// 用于记录代理后的结果，实现复用
const reactiveMap = new WeakMap()

function createReactiveObject(target) {
    if (!isObject(target)) {
        return target
    }

    if (target[ReactiveFlags.IS_REACTIVE]) {
        // 触发 proxy get 方法 --- 避免重复代理
        // const user = { name: 'CYQ', age: 18 }
        // const u1 = reactive(user)
        // const u2 = reactive(u1)
        return target
    }

    // 取缓存，如果有，直接用缓存内的，不用重复创建
    const exitsProxy = reactiveMap.get(target)
    if (exitsProxy) {
        return exitsProxy
    }

    const proxy = new Proxy(target, mutableHandlers)
    reactiveMap.set(target, proxy)
    return proxy
}

export function reactive(target) {
    return createReactiveObject(target)
}
