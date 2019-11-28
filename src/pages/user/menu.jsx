import React, { Component } from 'react';
import './menu.scss'
import {
  Table, Divider, Button, Modal, message, Form, Input, Select
} from 'antd';
import { reqMenuList, reqAddMenu, reqDeleteMenu, reqEditMenu } from '../../api/interface';
const { Option } = Select;
const { Column } = Table;

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: [],
      firstMenu: [], // 一级菜单列表
      level: 1, // 默认一级菜单
      visible: false,
      loading: false,
      parentId: 0,
      modelText: '添加菜单',
      firstSelectValue: '一级菜单',
      editMenuId: -1,
      secondSelctValue: ''
    }
  }
  componentDidMount() {
    this.getMenuList()
  }
  async getMenuList() {
    // 获得用户列表
    let result = await reqMenuList()
    let menuList = result.data
    let firstMenu = menuList.filter(v => { return v.parentId == 0 })
    this.setState({
      menuList,
      firstMenu
    })
  }
  onChangeSelect = (e) => {
    if (e == '2') {
      let firstMenu = this.state.menuList;
      if (firstMenu.length === 0) {
        message.error('暂无一级菜单，请先添加一级菜单！')
        return
      }
      this.setState({
        firstMenu,
        secondSelctValue: firstMenu[0].name,
        parentId: firstMenu[0].id,
      })
    } else {
      this.setState({
        parentId: 0
      })
    }
    this.setState({
      level: +e
    })
  }
  showModel = () => {
    // 展示弹出框
    this.onChangeSelect(1)
    let firstSelectValue = '一级菜单'
    this.setState({
      visible: true,
      modelText: '添加菜单',
      firstSelectValue
    })
  }
  handleCancel = e => {
    this.props.form.setFieldsValue({
      name: '',
      description: '',
    });
    this.setState({
      visible: false,
    });
  };
  handleOk = e => { // 点击确认按钮 添加角色
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { parentId, modelText, editMenuId } = this.state
        values.parentId = parentId;
        if (modelText === '添加菜单') {
          await reqAddMenu(values);
        } else {
          values.id = editMenuId
          await reqEditMenu(values);
        }
        this.handleCancel();
        this.getMenuList(); // 重新刷新数据
      }
    });
  };
  selectFirst = value => {
    // 选中父菜单
    this.setState({
      parentId: value
    })
  }
  editMenu = async (record) => {
    // 编辑用户
    let firstSelectValue
    if (record.parentId !== 0) {
      firstSelectValue = '二级菜单'
      this.onChangeSelect(2)
      let firstMenu = this.state.firstMenu
      let secondSelctValue = firstMenu.filter(v => {
        return v.id === record.parentId
      })
      this.setState({
        secondSelctValue: secondSelctValue[0].name,
        parentId: secondSelctValue[0].id
      })
    } else {
      firstSelectValue = '一级菜单'
      this.onChangeSelect(1)
    }
    this.setState({
      visible: true,
      modelText: '修改菜单',
      firstSelectValue,
      editMenuId: record.id
    })
    this.props.form.setFieldsValue({
      name: record.name,
      href: record.href,
      descript: record.descript
    });
  }
  deleteMenu = async (record) => {
    // 删除
    const model = Modal.confirm({
      title: '删除',
      content: `确认要删除${record.name}吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => { // 确定回调
        let result = await reqDeleteMenu(record.id)
        message.success(result.msg)
        this.getMenuList() // 重新刷新数据
        model.destroy()
      },
      onCancel: (e) => {  // 取消回调
        model.destroy()
      }
    });
  }
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys
    };
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
    const { getFieldDecorator } = this.props.form;
    const { firstMenu, firstSelectValue, secondSelctValue } = this.state;
    return (
      <div>
        <div className='header-title'>菜单管理</div>
        <Button type="primary" className='plus-class' icon='plus' onClick={this.showModel}>添加</Button>
        <div className='content'>
          <Table bordered className='table-class' pagination={pagination} rowKey={record => record.id} rowSelection={rowSelection} dataSource={this.state.menuList}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="菜单名称" dataIndex="name" key="name" />
            <Column title="菜单父ID" dataIndex="parentId" key="parentId" />
            <Column title="路由" dataIndex="href" key="href" />
            <Column title="描述" dataIndex="descript" key="descript" />
            <Column title="操作" key='action'
              render={(text, record) => (
                <span>
                  <Button type="danger" type="primary" icon='edit' onClick={this.editMenu.bind(this, record)}>编辑</Button>
                  <Divider type="vertical" />
                  <Button type="danger" icon='delete' onClick={this.deleteMenu.bind(this, record)}> 删除</Button>
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
            destroyOnClose
          >
            <Form {...formItemLayout}>
              <Form.Item label="菜单等级">
                <Select
                  id='first'
                  defaultValue={firstSelectValue}
                  onChange={this.onChangeSelect}
                >
                  <Option value="1">一级菜单</Option>
                  <Option value="2">二级菜单</Option>
                </Select>
              </Form.Item>
              {
                this.state.level == 1 ? null :
                  (<Form.Item label="父菜单">
                    <Select
                      defaultValue={secondSelctValue}
                      onSelect={this.selectFirst}
                    >
                      {
                        firstMenu.map(item => (
                          <Option value={item.id}>{item.name}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>)
              }
              <Form.Item label="菜单名">
                {getFieldDecorator('name', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '输入要添加的菜单名',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="菜单路由">
                {getFieldDecorator('href', {
                  initialValue: ''
                })(<Input />)}
              </Form.Item>
              <Form.Item label="描述">
                {getFieldDecorator('descript', {
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    )
  }
}
const WrappedMenu = Form.create()(Menu);
export default WrappedMenu