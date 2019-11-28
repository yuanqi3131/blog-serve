import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Router from '../../router';
import LeftMenu from '../.././components/LeftMenu';
import { Layout } from 'antd';
import './index.scss';
const { Header, Sider, Content } = Layout;
console.log(Router)

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: ''
    }
  }
  getCurrentTime() {
    // 获取当前时间
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    this.setState({
      currentTime: date
    })
  }
  componentDidMount() {
    this.getCurrentTime()
    setInterval(() => {
      this.getCurrentTime()
    }, 1000)
  }
  render() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      return <Redirect to='/login' />
    }
    return (
      <Layout className='layout'>
        <Sider className='layout-sider'>
          <div className='sider-title'>后台管理系统</div>
          <LeftMenu></LeftMenu>
        </Sider>
        <Layout className='layout-layout'>
          <Header className='header'>
            <div className='header-welcome'>欢迎，<span>{userInfo.username}({userInfo.roles[0].name})</span></div>
            <div>{this.state.currentTime}</div>
          </Header>
          <Content className='layout-content'>
            <div className='content-header'></div>
            <div className='conten-router'>
              <Router></Router>
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Admin