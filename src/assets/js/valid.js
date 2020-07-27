import {Toast} from 'vant';
class ValidForm{
    constructor(){
        this.validUserFormReg = {
            nickName:{
                // 昵称，1-10个字符，汉字字母数字_组合
                reg:/^[\u4e00-\u9fa5\w]{1,10}$/,
                msg:'昵称格式不正确'
            },
            phone:{
                // 手机号
                reg:/^1[3-9]\d{9}$/,
                msg:'手机号格式不正确'
            },
            password:{
                // 密码,首字符为字母，其他字符为数字字母下划线组合，6-16个字符
                reg:/^[a-zA-z]\w{5,15}$/,
                msg:'密码格式不正确且以字母开头'
            },
            // 旧密码
            oldPassword:{
                // 密码,首字符为字母，其他字符为数字字母下划线组合，6-16个字符
                reg:/^[a-zA-z]\w{5,15}$/,
                msg:'旧密码格式不正确且以字母开头'
            },
            // 邮箱
            email:{
                reg:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                msg:'邮箱格式不正确'
            },

            // 验证码
            securityCode:{
                reg:/^\d{6}$/,
                msg:'验证码不正确'
            }
        }
    }

    //验证表单
    validUserForm(o){
        for(let key in o){
            if(!this.validUserFormReg[key].reg.test(o[key])){
                Toast(this.validUserFormReg[key].msg);
                return false;
            }
        }
        //  表单验证通过
        return true;
    }
}

export default new ValidForm();