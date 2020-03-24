import events from 'events';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var ValidatorEmmiter =
/*#__PURE__*/
function (_events) {
  _inherits(ValidatorEmmiter, _events);

  function ValidatorEmmiter() {
    _classCallCheck(this, ValidatorEmmiter);

    // 子类 constructor 方法中必须有 super ，且必须出现在 this 之前。
    return _possibleConstructorReturn(this, _getPrototypeOf(ValidatorEmmiter).call(this));
  }

  return ValidatorEmmiter;
}(events);

var validatorEmmiter = new ValidatorEmmiter();
validatorEmmiter.setMaxListeners(100);
var isDef = function isDef(v) {
  return v !== undefined;
};

var validatorMixin = {
  data: function data() {
    return {
      validateResult: {
        curKey: ''
      }
    };
  },
  beforeCreate: function beforeCreate() {
    var _this = this;

    if (isDef(this.$options.validator)) {
      // console.log('has validator')
      var _uid = this._uid,
          validator = this.$options.validator; // console.log(_uid, validator)

      var _validator = validator.call(this); // console.log('_', _validator)


      var propConfig = {
        writable: false,
        enumerable: false // init

      };
      Object.keys(_validator).forEach(function (key) {
        _this.$nextTick(function () {
          _this.$set(_this.validateResult, key, "");
        });
      }); // init releated method
      // Object.defineProperties(obj, props)

      Object.defineProperties(_validator, {
        validate: _objectSpread2({
          value: function value(key) {
            validatorEmmiter.emit("".concat(_uid, "-").concat(key));
          }
        }, propConfig),
        reset: _objectSpread2({
          value: function value(key) {
            _this.validateResult[key] = "";
          }
        }, propConfig),
        validateAll: _objectSpread2({
          value: function value() {
            Object.keys(_validator).forEach(function (key) {
              // listenerCount 返回注册了指定事件的监听器数量。
              var haveListeners = function haveListeners(eventName) {
                return validatorEmmiter.listenerCount(eventName);
              };

              validatorEmmiter.emit("".concat(_uid, "-").concat(key));

              if (haveListeners("".concat(_uid, "-").concat(key))) {
                validatorEmmiter.emit("".concat(_uid, "-").concat(key));
              }
            });
            return Object.keys(_this.validateResult).every(function (item) {
              return _this.validateResult[item] === "";
            });
          }
        }, propConfig),
        resetAll: _objectSpread2({
          value: function value() {
            Object.keys(_validator).forEach(function (key) {
              _this.validateResult[key] = "";
            });
          }
        }, propConfig)
      }); // console.log('after', _validator)

      this.$validator = _validator; // console.log('after', this.$validator)
    }
  }
};

/* eslint-disable */
var plugin = (function (Vue) {
  var eventHandler = {};
  Vue.directive('validate', {
    bind: function bind(el, binding, vnode) {
      var modifiers = binding.modifiers,
          key = binding.value;
      var _uid = vnode.context._uid;
      var method = Object.keys(modifiers)[0]; // on

      validatorEmmiter.on("".concat(_uid, "-").concat(key), function (type) {
        var _vnode$context = vnode.context,
            validateResult = _vnode$context.validateResult,
            $validator = _vnode$context.$validator; // find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
        // console.log(Object.prototype.toString.call($validator[key]))
        // $validator[key] 字段规则数组

        var result = $validator[key].find(function (item) {
          return !item.need(); // 返回第一个验证不通过的规则，全部验证通过，返回undefined
        }); // console.log('res', result)

        validateResult[key] = isDef(result) ? result.warn : "";
        if (type === 'byModifier') validateResult['curKey'] = isDef(result) ? key : '';
      }); // emit

      if (method) {
        eventHandler["".concat(_uid, "-").concat(key)] = function () {

          validatorEmmiter.emit("".concat(_uid, "-").concat(key), 'byModifier');
        }; // 用户监听组件的事件，来emit对应的规则
        // vnode是vue的虚拟dom,vnode.componentInstance是当前节点对应的组件的实例，也就是说等同于vm。
        // 这里要知道vue的api方法不仅可以在template中使用，也可以在class中使用的，也是时说你可以@onChange=function，也可vm.on('on-change',function)
        // 这里注意在实例上的方法要使用横线命名的方法，等同于template的驼峰写法。


        if (vnode.componentInstance) {
          vnode.componentInstance.$on(method, eventHandler["".concat(_uid, "-").concat(key)]);
        } else {
          el.addEventListener(method, eventHandler["".concat(_uid, "-").concat(key)]);
        }
      }
    },
    unbind: function unbind(el, binding, vnode) {
      var modifiers = binding.modifiers,
          key = binding.value;
      var _vnode$context2 = vnode.context,
          _uid = _vnode$context2._uid,
          $validator = _vnode$context2.$validator;
      var method = Object.keys(modifiers)[0]; // reset & remove event

      $validator.reset(key);
      validatorEmmiter.removeAllListeners("".concat(_uid, "-").concat(key));

      if (method) {
        if (vnode.componentInstance) {
          vnode.componentInstance.$off(method, eventHandler["".concat(_uid, "-").concat(key)]);
        } else {
          el.removeEventListener(method, eventHandler["".concat(_uid, "-").concat(key)]);
        }
      }
    }
  });
});

export default plugin;
export { validatorMixin };
