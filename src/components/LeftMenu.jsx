import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import { reqGetMenu } from '../api/interface';
const { SubMenu } = Menu;

class LeftMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: []
    };
  }
  componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let roleId = userInfo.roles[0].userRole.roleId;
    this.getRoleMenu(roleId);
  }
  getRoleMenu = async (roleId) => {
    let result = await reqGetMenu(roleId)
    result = this.createTableDate(result.data)
    this.setState({
      menu: result
    })
  }
  createTableDate = (data) => {
    if (!Array.isArray(data)) return;
    let array = [];
    let childArray = [];
    data[0].menus.forEach(item => {
      item.children = []
      item.key = item.href
      console.log(item)
      if (item.parentId === 0) {
        array.push(item);
      } else {
        for (let i = 0; i < array.length; i++) {
          if (item.parentId === array[i].id) {
            childArray.push(item);
          }
          array[i].children = array[i].children.concat(childArray);
          childArray = []
        }
      }
    })
    return this.removeChildren(array)
  }
  removeChildren = (data) => {
    // 移出数据中空的children
    data.forEach((item) => {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        this.removeChildren(item.children)
      }
    })
    return data
  }
  createMenu = (data) => {
    // 创建菜单
    return data.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key + item.id}>
            <span>{item.name}</span>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.key + item.id}
            title={
              <span>
                <span>{item.name}</span>
              </span>
            }
          >
            {this.createMenu(item.children)}
          </SubMenu>
        )
      }
    })
  }
  linkTo(item) {
    this.props.history.push(item.key)
  }
  render() {
    return (
      <div>
        <Menu
          defaultSelectedKeys={['/']}
          defaultOpenKeys={['/system']}
          selectedKeys={[this.props.history.location.pathname]}
          mode="inline"
          theme="dark"
          onClick={this.linkTo.bind(this)}
        >
          {
            this.createMenu(this.state.menu)
          }
        </Menu>
      </div >
    )
  }
}

export default withRouter(LeftMenu)