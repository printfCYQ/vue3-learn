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
        return Reflect.get(target, key, recevier)
    },
    set(target, key, value, recevier) {
        return Reflect.set(target, key, value, recevier)
    }
}