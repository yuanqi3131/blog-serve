import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './index.scss';
import computeImg from './images/compute.png';
import { reqLogin } from '../../api/interface';

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let result = await reqLogin(values);
        localStorage.setItem('userInfo', JSON.stringify(result.data));
        this.props.history.push('/')
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login' id='login'>
        <img className='compute-img' src={computeImg} alt="" />
        <Form onSubmit={this.handleSubmit} className="login-form">
          <div className='form-desc'>欢迎登录用户管理系统</div>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名' }, { min: 4, message: '用户名最少4位' }, { max: 16, message: '用户名最多16位' }]
            })(
              <Input
                className='input-class'
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="输入用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input
                className='input-class'
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="输入密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
          </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const WrapLogin = Form.create()(Login)
export default WrapLogin