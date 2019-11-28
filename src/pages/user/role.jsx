import React, { Component } from 'react';
import './role.scss'
import {
  Table, Divider, Button, Modal, message, Form, Input
} from 'antd';
import moment from 'moment'
import { reqRoleList, reqAddRole, reqDeleteRole, reqMenuList, reqCreateRoleMenu, reqRoleMenu } from '../../api/interface';
const { Column } = Table;

class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleList: [],
      visible: false,
      loading: false,
      avatar: '',
      modelText: '添加用户',
      visibleEdit: false,
      assignMenu: []
    }
  }
  componentDidMount() {
    this.getRoleList()
  }
  async getRoleList() {
    // 获得用户列表
    let result = await reqRoleList()
    let roleList = result.data
    this.setState({
      roleList
    })
  }
  async getMenuList() {
    // 获得用户列表
    let result = await reqMenuList()
    let res = await reqRoleMenu(this.state.chooseRole.id);
    res = res.data.map(v => v.menuId)
    let menuList = result.data
    let assignMenu = this.createTableDate(menuList)
    this.setState({
      menuList,
      assignMenu,
      selectedRowKeys: res
    })
    this.setState({
      rowSelection1: {
        selectedRowKeys: res,
        onChange: this.onSelectChange1,
      }
    })
  }
  createTableDate = (data) => {
    if (!Array.isArray(data)) return;
    let array = [];
    let childArray = [];
    data.forEach(item => {
      item.children = []
      item.key = item.id
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
  format(time) {
    // 格式化时间
    return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
  }
  showModel = () => {
    // 展示弹出框
    this.setState({
      visible: true
    })
  }
  handleCancel = e => {
    this.props.form.setFieldsValue({
      name: '',
      description: ''
    });
    this.setState({
      visible: false,
      visibleEdit: false
    });
  };
  handleOk = e => { // 点击确认按钮 添加角色
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await reqAddRole(values)
        this.handleCancel()
        this.getRoleList() // 重新刷新数据
      }
    });
  };
  handleAssign = async e => {
    // 分配菜单
    e.preventDefault();
    const { selectedRowKeys, chooseRole } = this.state
    if (selectedRowKeys.length === 0) {
      message.error('请至少分配一个菜单');
      return;
    }
    let obj = {
      roleId: chooseRole.id,
      menuId: selectedRowKeys.join(',')
    }
    await reqCreateRoleMenu(obj)
    message.success('分配菜单成功!');
    this.getRoleList();
    this.handleCancel();
  }
  editUser = async (record) => {
    // 编辑用户
    console.log(record)
    this.setState({
      visible: true,
      modelText: '修改用户',
      imageUrl: record.resources.length && "/api/img?id=" + record.resources[0].id
    })
    console.log(record)
    this.props.form.setFieldsValue({
      username: record.username,
      password: record.password,
      email: record.email,
    });
  }
  assignRole = async (record) => {
    // 分配菜单
    const chooseRole = record
    this.setState({
      visibleEdit: true,
      chooseRole
    })
    this.getMenuList();
  }
  deleteRole = async (record) => {
    // 删除
    const model = Modal.confirm({
      title: '删除',
      content: `确认要删除${record.name}角色吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => { // 确定回调
        let result = await reqDeleteRole(record.id)
        message.success(result.msg)
        this.getRoleList() // 重新刷新数据
        model.destroy()
      },
      onCancel: (e) => {  // 取消回调
        model.destroy()
      }
    });
  }
  onSelectChange1 = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  render() {
    const { rowSelection1 } = this.state;
    const pagination = {
      // 分页器配置
      defaultCurrent: 1,
      defaultPageSize: 6,
      pageSize: 6
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const columns = [
      {
        title: '菜单名',
        dataIndex: 'name',
        key: 'name',
      }
    ];
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className='header-title'>角色管理</div>
        <Button type="primary" className='plus-class' icon='plus' onClick={this.showModel}>添加</Button>
        <div className='content'>
          <Table bordered className='table-class' pagination={pagination} dataSource={this.state.roleList}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="角色名" dataIndex="name" key="name" />
            <Column title="创建时间" dataIndex="createTime" key="createTime"
              render={text => {
                return this.format(text)
              }}
            />
            <Column title="备注" dataIndex="description" key="description" />
            <Column title="操作" key='action'
              render={(text, record) => (
                <span>
                  <Button className='role-button' icon='star' onClick={this.assignRole.bind(this, record)}>分配菜单</Button>
                  <Divider type="vertical" />
                  <Button type="danger" icon='delete' onClick={this.deleteRole.bind(this, record)}> 删除</Button>
                </span>
              )} />
          </Table>
          <Modal
            title={this.state.modelText}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            className='model-class'
            okText="确认"
            cancelText="取消"
          >
            <Form {...formItemLayout}>
              <Form.Item label="角色名">
                {getFieldDecorator('name', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '输入要添加的角色名',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="描述">
                {getFieldDecorator('description', {
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title='分配菜单'
            visible={this.state.visibleEdit}
            onOk={this.handleAssign}
            onCancel={this.handleCancel}
            className='model-class'
            okText="确认"
            cancelText="取消"
            width='40%'
            destroyOnClose
          >
            <Table className='assign-menu' columns={columns} pagination={false} bordered={true} rowSelection={rowSelection1} dataSource={this.state.assignMenu} />
          </Modal>
        </div>
      </div>
    )
  }
}
const WrappedRole = Form.create()(Role);
export default WrappedRole