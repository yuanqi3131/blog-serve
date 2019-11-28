import React, { Component } from 'react';
import './add.scss';
import { Form, Input, Button, Select, message } from 'antd';
import { reqAddArticle, reqTagList, reqArticleList } from '../../api/interface'

// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 10 },
};
const formTailLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8, offset: 2 },
};
const { Option } = Select;
class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null),
      tagList: [],
      editItem: null
    };
  }
  async componentDidMount() {
    let state = this.props.location.state
    let id = state ? state.id : -1
    if (id !== -1) {
      let result = await reqArticleList(id)
      this.setState({
        editItem: result.data
      })
    }
    let result = await reqTagList()
    this.setState({
      tagList: result.data
    })
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  check = () => {
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        let obj = {
          title: value.title,
          tagId: value.tagId,
          content: value.content.toHTML(),
          isTop: value.isTop,
          userId: userInfo.id
        }
        try {
          let result = await reqAddArticle(obj)
          message.success(result.msg)
        } catch (error) {
          console.log(error)
        }
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { editItem } = this.state
    return (
      <div>
        <div className='header-title'>发布文章</div>
        <div className='content'>
          <Form.Item {...formItemLayout} label="标题">
            {getFieldDecorator('title', {
              initialValue: editItem ? editItem.title : '',
              rules: [
                {
                  required: true,
                  message: '输入博客标题',
                },
              ],
            })(<Input placeholder="请输入博客标题" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="所属标签">
            {getFieldDecorator('tagId', {
              initialValue: editItem ? editItem.tag.name : '',
              rules: [
                { required: true, message: '请选择所属标签' },
              ],
            })(<Select placeholder="请选择所属标签" className='select-class'>
              {
                this.state.tagList.map((item, index) => {
                  return <Option key={index} value={item.id}>{item.name}</Option>
                })
              }
            </Select>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="是否置顶">
            {getFieldDecorator('isTop', {
              initialValue: editItem ? (editItem.isTop === 0 ? '否' : '是') : '',
              rules: [{ required: true, message: '请选择是否置顶!' }],
            })(
              <Select placeholder="请选择是否置顶" className='select-class'>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="内容">
            {getFieldDecorator('content', {
              initialValue: editItem ? editItem.content : '',
              rules: [{ required: true, message: '请填写博客内容!' }],
            })(
              <BraftEditor
                className='my-component'
                onChange={this.handleEditorChange}
              />
            )}
          </Form.Item>
          <Form.Item {...formTailLayout}>
            <Button className='submit-class' type="primary" onClick={this.check}>
              提交
          </Button>
          </Form.Item>
        </div>
      </div>
    )
  }
}

const WrapArticle = Form.create({ name: 'dynamic_rule' })(Article);
export default WrapArticle