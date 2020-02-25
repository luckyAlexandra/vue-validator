import events from 'events';

/* eslint-disable */

class ValidatorEmmiter extends events {
  constructor() {
    // 子类 constructor 方法中必须有 super ，且必须出现在 this 之前。
    super();
  }

}

const validatorEmmiter = new ValidatorEmmiter();
validatorEmmiter.setMaxListeners(100);
const isDef = v => v !== undefined;

/* eslint-disable */
const validatorMixin = {
  data() {
    return {
      validateResult: {}
    };
  },

  beforeCreate() {
    if (isDef(this.$options.validator)) {
      // console.log('has validator')
      const {
        _uid,
        $options: {
          validator
        }
      } = this; // console.log(_uid, validator)

      const _validator = validator.call(this); // console.log('_', _validator)


      const propConfig = {
        writable: false,
        enumerable: false // init

      };
      Object.keys(_validator).forEach(key => {
        this.$nextTick(() => {
          this.$set(this.validateResult, key, "");
        });
      }); // init releated method
      // Object.defineProperties(obj, props)

      Object.defineProperties(_validator, {
        validate: {
          value(key) {
            validatorEmmiter.emit(`${_uid}-${key}`);
          },

          ...propConfig
        },
        reset: {
          value: key => {
            this.validateResult[key] = "";
          },
          ...propConfig
        },
        validateAll: {
          value: () => {
            Object.keys(_validator).forEach(key => {
              // listenerCount 返回注册了指定事件的监听器数量。
              const haveListeners = eventName => validatorEmmiter.listenerCount(eventName);

              validatorEmmiter.emit(`${_uid}-${key}`);

              if (haveListeners(`${_uid}-${key}`)) {
                validatorEmmiter.emit(`${_uid}-${key}`);
              }
            });
            return Object.keys(this.validateResult).every(item => this.validateResult[item] === "");
          },
          ...propConfig
        },
        resetAll: {
          value: () => {
            Object.keys(_validator).forEach(key => {
              this.validateResult[key] = "";
            });
          },
          ...propConfig
        }
      }); // console.log('after', _validator)

      this.$validator = _validator; // console.log('after', this.$validator)
    }
  }

};

/* eslint-disable */
var plugin = (Vue => {
  const eventHandler = {};
  Vue.directive('validate', {
    bind: (el, binding, vnode) => {
      const {
        modifiers,
        value: key
      } = binding;
      const {
        context: {
          _uid
        }
      } = vnode;
      const method = Object.keys(modifiers)[0]; // on

      validatorEmmiter.on(`${_uid}-${key}`, () => {
        const {
          context: {
            validateResult,
            $validator
          }
        } = vnode; // find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
        // console.log(Object.prototype.toString.call($validator[key]))
        // $validator[key] 字段规则数组

        const result = $validator[key].find(item => {
          return !item.need(); // 返回第一个验证不通过的规则，全部验证通过，返回undefined
        }); // console.log('res', result)

        validateResult[key] = isDef(result) ? result.warn : "";
      }); // emit

      if (method) {
        eventHandler[`${_uid}-${key}`] = () => {

          validatorEmmiter.emit(`${_uid}-${key}`);
        }; // 用户监听组件的事件，来emit对应的规则
        // vnode是vue的虚拟dom,vnode.componentInstance是当前节点对应的组件的实例，也就是说等同于vm。
        // 这里要知道vue的api方法不仅可以在template中使用，也可以在class中使用的，也是时说你可以@onChange=function，也可vm.on('on-change',function)
        // 这里注意在实例上的方法要使用横线命名的方法，等同于template的驼峰写法。


        if (vnode.componentInstance) {
          vnode.componentInstance.$on(method, eventHandler[`${_uid}-${key}`]);
        } else {
          el.addEventListener(method, eventHandler[`${_uid}-${key}`]);
        }
      }
    },
    unbind: function (el, binding, vnode) {
      const {
        modifiers,
        value: key
      } = binding;
      const {
        context: {
          _uid,
          $validator
        }
      } = vnode;
      const method = Object.keys(modifiers)[0]; // reset & remove event

      $validator.reset(key);
      validatorEmmiter.removeAllListeners(`${_uid}-${key}`);

      if (method) {
        if (vnode.componentInstance) {
          vnode.componentInstance.$off(method, eventHandler[`${_uid}-${key}`]);
        } else {
          el.removeEventListener(method, eventHandler[`${_uid}-${key}`]);
        }
      }
    }
  });
});

export default plugin;
export { validatorMixin };
