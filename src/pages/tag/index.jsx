import React, { Component } from 'react';
import {
  Table, Divider, Button, Modal, Form, Input, message
} from 'antd';
import { reqTagList, reqAddTag, reqUpdateTag, reqDeleteTag } from '../../api/interface';
import './index.scss'

const { Column } = Table;
class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList: [], // 标签列表
      selectedRowKeys: [],
      visible: false, // 控制弹出框的展示
      modelContent: '', // model input输入框的内容
      editObj: null // 编辑内容
    }
  }
  componentDidMount() {
    this.getTagList()
  }
  async getTagList() {
    // 获得标签列表
    let result = await reqTagList()
    let tagList = result.data
    if (tagList.length > 0) {
      tagList.forEach((item, index) => {
        tagList[index]['key'] = item.id
      })
    }
    this.setState({
      tagList: tagList
    })
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  handleOk = e => { // 点击确认按钮 添加标签
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { editObj, modelContent } = this.state
        let result
        if (editObj) { // 更新
          editObj.name = modelContent
          result = await reqUpdateTag(editObj)
        } else {
          result = await reqAddTag(values.name.trim())
        }
        message.success(result.msg)
        this.props.form.setFieldsValue({ // 清空input的值
          name: '',
        });
        this.setState({ // 关闭model
          visible: false,
          modelContent: '',
          editObj: null
        })

        this.getTagList() // 重新刷新数据
      }
    });
  };
  showModel = () => {
    // 展示弹出框
    this.setState({
      visible: true
    })
  }
  handleCancel = e => {
    this.props.form.setFieldsValue({
      name: '',
    });
    this.setState({
      visible: false,
      modelContent: '',
      editObj: null
    });
  };
  editTag = async (record) => {
    // 编辑
    this.props.form.setFieldsValue({
      name: record.name,
    });
    this.setState({
      visible: true,
      modelContent: record.name,
      editObj: record
    })
  }
  deleteTag = async (record) => {
    // 编辑
    const model = Modal.confirm({
      title: '删除',
      content: `确认要删除${record.name}标签吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => { // 确定回调
        let result = await reqDeleteTag(record.id)
        message.success(result.msg)
        this.getTagList() // 重新刷新数据
        model.destroy()
      },
      onCancel: (e) => {  // 取消回调
        model.destroy()
      }
    });
  }
  contentChange = (e) => {
    // input改变触发函数
    let value = e.target.value
    this.setState({
      modelContent: value
    })
  }
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    const pagination = {
      // 分页器配置
      defaultCurrent: 1,
      defaultPageSize: 6,
      pageSize: 6
    }
    return (
      <div>
        <div className='header-title'>标签管理</div>
        <Button type="primary" className='plus-class' icon='plus' onClick={this.showModel}>添加</Button>
        <Table bordered className='table-class' pagination={pagination} rowSelection={rowSelection} dataSource={this.state.tagList}>
          <Column title="标签名" dataIndex="name" key="name" />
          <Column title="创建时间" dataIndex="createTime" key="createTime" />
          <Column title="操作" key='action'
            render={(text, record) => (
              < span >
                <Button type="primary" icon='edit' onClick={this.editTag.bind(this, record)} > 修改</Button>
                <Divider type="vertical" />
                <Button type="danger" icon='delete' onClick={this.deleteTag.bind(this, record)}>删除</Button>
              </span >
            )} />
        </Table>
        <Modal
          title="添加标签"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className='model-class'
        >
          <Form {...formItemLayout}>
            <Form.Item label="标签名">
              {getFieldDecorator('name', {
                initialValue: this.state.modelContent,
                rules: [
                  {
                    required: true,
                    message: '请输入要添加的标签名',
                  }
                ],
              })(<Input onChange={this.contentChange} />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedTag = Form.create()(Tag);
export default WrappedTag