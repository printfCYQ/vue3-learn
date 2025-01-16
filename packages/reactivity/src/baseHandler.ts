import { track, trigger } from "./reactiveEffect";

export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive"
}

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, recevier) {
        // 避免重复代理情况
        // const user = { name: 'CYQ', age: 18 }
        // const u1 = reactive(user)
        // const u2 = reactive(u1)
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }

        track(target, key); // 收集 target[key] 和 effect 关联

        return Reflect.get(target, key, recevier)
    },
    set(target, key, value, recevier) {
        let oldValue = target[key]
        const result = Reflect.set(target, key, value, recevier)
        if (oldValue !== value) {
            // 需要触发更新
            trigger(target, key, value, oldValue)
        }
        return result
    }
}