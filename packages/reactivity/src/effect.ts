export function effect(fn, options) {
    // effect 函数的主要作用是创建一个副作用函数，它会自动追踪其内部使用的响应式数据。当这些响应式数据发生变化时，该副作用函数会被重新执行。

    const _effect = new ReactiveEffect(fn, () => {
        _effect.run()
    })

    _effect.run()
}

function preCleanEffect(effect) {
    effect._depsLength = 0
    effect._trackId++ // 用于判断是不是同一个effect（第几次执行）
}

function postCleanEffect(effect) {
    // 第一次收集属性有 [a, b, c, d]
    // 第二次收集属性有 [a, b]
    // c, d 要被删除
    if (effect.deps.length > effect._depsLength) {
        for (let i = effect._depsLength; i < effect.deps.length; i++) {
            cleanDepEffect(effect.deps[i], effect)
        }
        effect.deps.length = effect._depsLength
    }
}

export let activeEffect;
class ReactiveEffect {
    _trackId = 0; // 用于记录当前 effect 执行了几次（防止一个属性在当前effect中多次依赖收集）
    deps = [];
    _depsLength = 0;


    public active = true; // 创建的effect是否是响应式的

    constructor(public fn, public scheduler) { }

    run() {
        if (!this.active) {
            return this.fn()
        }

        let lastEffect = activeEffect // 记住上一个 解决嵌套 effect
        try {
            activeEffect = this

            // effect 重新执行前，清空上一次的依赖 effect.deps
            preCleanEffect(this)

            return this.fn(); // 依赖收集
        } finally {

            // 删除多余（新的一次可能比上一次少）的依赖收集
            postCleanEffect(this)

            activeEffect = lastEffect
        }
    }
}

function cleanDepEffect(dep, effect) {
    dep.delete(effect)
    if (dep.size === 0) {
        dep.cleanup()
    }
}

export function trackEffects(effect, dep) {

    if (dep.get(effect) !== effect._trackId) {
        // 判断 effect 是不是同一次执行
        dep.set(effect, effect._trackId) // 更新id

        let oldDep = effect.deps[effect._depsLength]
        if (oldDep !== dep) {
            if (oldDep) {
                // 删除旧的依赖
                cleanDepEffect(oldDep, effect)
            }
            // 设置新的依赖
            effect.deps[effect._depsLength++] = dep
        } else {
            effect._depsLength++
        }
    }

    // dep.set(effect, effect._trackId);
    // effect.deps[effect._depsLength++] = dep; // 让effect和dep关联
}

export function triggerEffects(dep) {
    for (const effect of dep.keys()) {
        if (effect.scheduler) {
            effect.scheduler()
        }
    }
}