import { activeEffect, trackEffects, triggerEffects } from "./effect";

const targetMap = new WeakMap(); // 存放依赖收集的关系

export const createDep = (cleanup, key) => {
    const dep = new Map() as any
    dep.cleanup = cleanup
    dep.name = key
    return dep
}

export function track(target, key) {

    // activeEffect 上有key这个属性 ? key是在effect函数中访问的 : 不是在effect函数内访问 
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            // 新增的
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(
                key,
                dep = createDep(() => depsMap.delete(key), key) // 用于清理不需要的属性
            )
        }

        trackEffects(activeEffect, dep); // 依赖收集:将当前 ēffect 添加到 dep（映射表）中，后续根据值的变化，触发dep中的effect
    }
}

export function trigger(target, key, value, oldValue) {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        // 不存在---对象没被收集依赖
        return
    }

    const dep = depsMap.get(key)
    if (dep) {
        // 找到被修改的属性 执行所有effect
        triggerEffects(dep);
    }
}