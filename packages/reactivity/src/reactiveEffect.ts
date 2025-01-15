import { activeEffect } from "./effect";

export function track(target, key) {

    // activeEffect 上有key这个属性 ? key是在effect函数中访问的 : 不是在effect函数内访问

    if (activeEffect) {
        console.log(activeEffect, key);
    }
}