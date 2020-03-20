/* eslint-disable */
// 安装 Vue.js 插件。
// 如果插件是一个对象，必须提供 install 方法。
// 如果插件是一个函数，它会被作为 install 方法。
// install 方法调用时，会将 Vue 作为参数传入。
// 该方法需要在调用 new Vue() 之前被调用。

/* eslint-disable */
import {validatorEmmiter, isDef} from './util.js'

export default (Vue) => {
  const eventHandler = {}
  Vue.directive('validate', {
    bind: (el, binding, vnode) => {

      const { modifiers, value: key } = binding
      const {
        context: { _uid }
      } = vnode
      const method = Object.keys(modifiers)[0]

      // on
      validatorEmmiter.on(`${_uid}-${key}`, (type) => {
        let {
          context: { validateResult, $validator }
        } = vnode

        // find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
        // console.log(Object.prototype.toString.call($validator[key]))
        // $validator[key] 字段规则数组
        const result = $validator[key].find(item => {
          return !item.need() // 返回第一个验证不通过的规则，全部验证通过，返回undefined
        })

        // console.log('res', result)

        validateResult[key] = isDef(result) ? result.warn : "";
        if (type === 'byModifier') validateResult['curKey'] = isDef(result) ? key : ''
      })

      // emit
      if (method) {
        eventHandler[`${_uid}-${key}`] = () => {
          const haveListeners = eventName => validatorEmmiter.listenerCount(eventName)
          validatorEmmiter.emit(`${_uid}-${key}`, 'byModifier')
        }

        // 用户监听组件的事件，来emit对应的规则
        // vnode是vue的虚拟dom,vnode.componentInstance是当前节点对应的组件的实例，也就是说等同于vm。
        // 这里要知道vue的api方法不仅可以在template中使用，也可以在class中使用的，也是时说你可以@onChange=function，也可vm.on('on-change',function)
        // 这里注意在实例上的方法要使用横线命名的方法，等同于template的驼峰写法。
        if (vnode.componentInstance){
          vnode.componentInstance.$on(method, eventHandler[`${_uid}-${key}`])
        } else {
          el.addEventListener(method, eventHandler[`${_uid}-${key}`])
        }
      }
    },
    unbind: function (el, binding, vnode) {

      const { modifiers, value: key } = binding
      const {
        context: { _uid, $validator }
      } = vnode
      const method = Object.keys(modifiers)[0]

      // reset & remove event
      $validator.reset(key)
      validatorEmmiter.removeAllListeners(`${_uid}-${key}`)
      if (method) {
        if (vnode.componentInstance) {
          vnode.componentInstance.$off(
            method,
            eventHandler[`${_uid}-${key}`]
          )
        } else {
          el.removeEventListener(method, eventHandler[`${_uid}-${key}`])
        }
      }
    }
  })
}
