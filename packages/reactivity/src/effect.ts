export function effect(fn, options) {
    // effect 函数的主要作用是创建一个副作用函数，它会自动追踪其内部使用的响应式数据。当这些响应式数据发生变化时，该副作用函数会被重新执行。

    const _effect = new ReactiveEffect(fn, () => {
        _effect.run()
    })

    _effect.run()
}

export let activeEffect;
class ReactiveEffect {
    _trackId = 0; // 用于记录当前 effect 执行了几次
    deps = [];
    _depsLength = 0;


    public active = true; // 创建的effect是否是响应式的

    constructor(public fn, public scheduler) { }

    run() {
        if (!this.active) {
            return this.fn()
        }

        let lastEffect = activeEffect // 记住上一个 解决嵌套 effect
        console.log('lastEffect', lastEffect);
        try {
            activeEffect = this
            return this.fn(); // 依赖收集
        } catch (error) {

        } finally {
            activeEffect = lastEffect
        }
    }
}

export function trackEffects(effect, dep) {
    dep.set(effect, effect._trackId);

    effect.deps[effect._depsLength++] = dep; // 让effect和dep关联
}

export function triggerEffects(dep) {
    for (const effect of dep.keys()) {
        if (effect.scheduler) {
            effect.scheduler()
        }
    }
}