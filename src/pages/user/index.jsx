import React, { Component } from 'react';
import './index.scss'
import {
  Table, Divider, Button, Modal, message, Form, Input, Upload, Icon
} from 'antd';
import moment from 'moment'
import { reqUserList, reqRegister, reqDeleteUser, reqRoleList, reqAddUserRole } from '../../api/interface';
const { Column } = Table;
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      visible: false,
      loading: false,
      avatar: '',
      modelText: '添加用户',
      roleList: [],
      visibleRole: false,
      selectUser: null
    }
  }
  componentDidMount() {
    this.getUserList()
  }
  async getUserList() {
    // 获得用户列表
    let result = await reqUserList()
    let userList = result.data
    this.setState({
      userList
    })
  }
  async getRoleList() {
    // 获得用户列表
    let result = await reqRoleList()
    let roleList = result.data
    this.setState({
      roleList
    })
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
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.setState({
        avatar: info.file.response.url
      })
      console.log(info)
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };
  handleCancel = () => {
    this.props.form.setFieldsValue({
      username: '',
      password: '',
      email: ''
    });
    this.setState({
      visible: false,
      imageUrl: '',
      visibleRole: false,
      selectedRowKeys1: []
    });
  };
  handleOk = e => { // 点击确认按钮 添加标签
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { avatar } = this.state
        values.avatar = avatar
        await reqRegister(values)
        this.handleCancel()
        this.getUserList() // 重新刷新数据
      }
    });
  };
  handleRole = async () => {
    let { roleList, selectedRowKeys1, selectUser } = this.state
    if (!selectedRowKeys1.length) {
      message.error('请选择角色！');
      return
    }
    let roleId = roleList[selectedRowKeys1[0]].id
    let userId = selectUser.id
    await reqAddUserRole({ roleId, userId })
    message.success('分配角色成功')
    this.handleCancel();
    this.getUserList();
  }
  editUser = async (record) => {
    // 编辑用户
    this.setState({
      visible: true,
      modelText: '修改用户',
      imageUrl: record.resources.length && "/api/img?id=" + record.resources[0].id
    })
    this.props.form.setFieldsValue({
      username: record.username,
      password: record.password,
      email: record.email,
    });
  }
  beginRole = async (record) => {
    this.setState({
      visibleRole: true,
      selectUser: record
    })
    this.getRoleList()
  }
  deleteUser = async (record) => {
    // 删除
    const model = Modal.confirm({
      title: '删除',
      content: `确认要删除${record.username}标签吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => { // 确定回调
        let result = await reqDeleteUser(record.id)
        message.success(result.msg)
        this.getUserList() // 重新刷新数据
        model.destroy()
      },
      onCancel: (e) => {  // 取消回调
        model.destroy()
      }
    });
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  onSelectChange1 = selectedRowKeys1 => {
    this.setState({ selectedRowKeys1 });
  };
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    const { selectedRowKeys, selectedRowKeys1, imageUrl } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const rowSelection1 = {
      selectedRowKeys1,
      onChange: this.onSelectChange1,
      type: 'radio'
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
    return (
      <div>
        <div className='header-title'>用户管理</div>
        <Button type="primary" className='plus-class' icon='plus' onClick={this.showModel}>添加</Button>
        <div className='content'>
          <Table bordered className='table-class' pagination={pagination} rowSelection={rowSelection} dataSource={this.state.userList}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="用户名" dataIndex="username" key="username" />
            <Column title="邮箱" dataIndex="email" key="email" />
            <Column className='avatar-class' title="头像" dataIndex="resources" key="resources"
              render={text => {
                return text.length ? <img src={"/api/img?id=" + text[0].id} /> : ''
              }}
            />
            <Column title="角色" dataIndex="roles" key="roles"
              render={text => {
                return text.length ? text[0].name : ''
              }}
            />
            <Column title="创建时间" dataIndex="createTime" key="createTime"
              render={text => {
                return this.format(text)
              }}
            />
            <Column title="操作" key='action'
              render={(text, record) => (
                <span>
                  <Button className='role-button' icon='star' onClick={this.beginRole.bind(this, record)}>分配角色</Button>
                  <Divider type="vertical" />
                  {/* <Button type="primary" icon='edit' onClick={this.editUser.bind(this, record)}>修改</Button>
                  <Divider type="vertical" /> */}
                  <Button type="danger" icon='delete' onClick={this.deleteUser.bind(this, record)}> 删除</Button>
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
              <Form.Item label="用户名">
                {getFieldDecorator('username', {
                  initialValue: this.state.modelContent,
                  rules: [
                    {
                      required: true,
                      message: '输入要添加的用户',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('password', {
                  initialValue: this.state.modelContent,
                  rules: [
                    {
                      required: true,
                      message: '输入要添加的用户',
                    }
                  ],
                })(<Input type='password' />)}
              </Form.Item>
              <Form.Item label="邮箱">
                {getFieldDecorator('email', {
                  initialValue: this.state.modelContent,
                  rules: [
                    {
                      required: true,
                      message: '输入要添加的用户',
                    }
                  ],
                })(<Input />)}
              </Form.Item>
              <div className='upload-class'>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="/api/upload"
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </div>
            </Form>
          </Modal>
          <Modal
            title='分配角色'
            visible={this.state.visibleRole}
            onOk={this.handleRole}
            onCancel={this.handleCancel}
            className='model-class'
            okText="确认"
            cancelText="取消"
            width='40%'
            destroyOnClose={true}
            bodyStyle={{ maxHeight: '400px', overflow: 'auto' }}
          >
            <Table bordered className='table-class' pagination={false} rowSelection={rowSelection1} dataSource={this.state.roleList}>
              <Column title="ID" dataIndex="id" key="id" />
              <Column title="角色名" dataIndex="name" key="name" />
              <Column title="备注" dataIndex="description" key="description" />
            </Table>
          </Modal>
        </div>
      </div>
    )
  }
}

const WrappedUser = Form.create()(User);
export default WrappedUser