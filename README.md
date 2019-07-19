```
npm i z-vue-validator
```

在index.js使用插件
```
import Validator from 'vue-validator'

Vue.use(Validator)
```

模板语法
```
<input type="text" 
  v-model="phone" 
  v-validate.input="'phone'"
  />

<span>{{validateResult.phone}}</span>

<button @click="submit">提交</button>
```

规则定义与方法调用
```
import {validatorMixin} from 'vue-validator'
export default {
  mixins: [validatorMixin],
  data () {
    return {
      phone: ''
    }
  },
  validator () {
    return {
      phone: [
        {
          need: () => !!this.phone,
          warn: "请输入法人手机号码"
        },
        {
          need: () => {
            let reg = /^\d{11}$/
            return reg.test(this.phone)
          },
          warn: "请输入正确的法人手机号码"
        }
      ]
    }
  },
  methods: {
    submit () {
      if (this.$validator.validateAll()) {
        alert('ok submit')
      }
    }
  }
}
```