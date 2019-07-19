/* eslint-disable */

// validatorEmmiter 的实现，特别简易，利用了 node 的 events 模块
import events from 'events'

class ValidatorEmmiter extends events {
  constructor() {
    // 子类 constructor 方法中必须有 super ，且必须出现在 this 之前。
    super()
  }
}

export const validatorEmmiter = new ValidatorEmmiter()
validatorEmmiter.setMaxListeners(100)

export const isDef = v => v !== undefined
