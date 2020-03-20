/* eslint-disable */
import {validatorEmmiter, isDef} from './util.js'

export const validatorMixin = {
  data () {
    return {
      validateResult: {
        curKey: ''
      },
    }
  },
  beforeCreate () {
    if (isDef(this.$options.validator)) {
      // console.log('has validator')
      const {
        _uid,
        $options: {validator}
      } = this

      // console.log(_uid, validator)

      const _validator = validator.call(this)

      // console.log('_', _validator)

      const propConfig = {
        writable: false,
        enumerable: false
      }

      // init
      Object.keys(_validator).forEach(key => {
        this.$nextTick(() => {
          this.$set(this.validateResult, key, "")
        })
      })
      // init releated method
      // Object.defineProperties(obj, props)
      Object.defineProperties(_validator, {
        validate: {
          value(key) {
            validatorEmmiter.emit(`${_uid}-${key}`)
          },
          ...propConfig
        },
        reset: {
          value: key => {
            this.validateResult[key] = ""
          },
          ...propConfig
        },
        validateAll: {
          value: () => {
            Object.keys(_validator).forEach(key => {
              // listenerCount 返回注册了指定事件的监听器数量。
              const haveListeners = eventName => validatorEmmiter.listenerCount(eventName)
              validatorEmmiter.emit(`${_uid}-${key}`)
              if (haveListeners(`${_uid}-${key}`)) {
                validatorEmmiter.emit(`${_uid}-${key}`)
              }
            })
            return Object.keys(this.validateResult).every(
              item => this.validateResult[item] === ""
            )
          },
          ...propConfig
        },
        resetAll: {
          value: () => {
            Object.keys(_validator).forEach(key => {
              this.validateResult[key] = ""
            })
          },
          ...propConfig
        }
      })

      // console.log('after', _validator)

      this.$validator = _validator

      // console.log('after', this.$validator)
    }
  }
}
