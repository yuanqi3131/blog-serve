import React, { Component } from 'react';
import {
  Table, Divider, Button, Modal, message
} from 'antd';
import moment from 'moment'
import { reqArticleList, reqDeleteArticle } from '../../api/interface';
const { Column } = Table;
class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      articleList: []
    }
  }
  componentDidMount() {
    this.getArticleList()
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  async getArticleList() {
    let result = await reqArticleList();
    this.setState({
      articleList: result.data
    })
  }
  format(time) {
    // 格式化时间
    return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
  }
  showTop(status) {
    // 展示置顶
    if (status === 0) {
      return <Button type="primary">不置顶</Button>
    } else {
      return <Button type="danger">置顶</Button>
    }
  }
  editArticle(record) {
    // 编辑文章 跳转发布文章页
    this.props.history.push({ pathname: "/article/add", state: { id: record.id } });
  }
  deleteArticle(record) {
    // 删除文章
    const model = Modal.confirm({
      title: '删除',
      content: `确认要删除${record.title}吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => { // 确定回调
        let result = await reqDeleteArticle(record.id)
        message.success(result.msg)
        this.getArticleList() // 重新刷新数据
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
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const pagination = {
      // 分页器配置
      defaultCurrent: 1,
      defaultPageSize: 6,
      pageSize: 6
    }
    return (
      <div>
        <div className='header-title'>文章列表</div>
        <div className='content'>
          <Table bordered className='table-class' pagination={pagination} rowSelection={rowSelection} dataSource={this.state.articleList}>
            <Column title="博客标题" dataIndex="title" key="title" />
            <Column title="所属用户" dataIndex="user.username" key="user.username" />
            <Column title="是否置顶" dataIndex="isTop" key="isTop"
              render={text => {
                return this.showTop(text)
              }}
            />
            <Column title="创建时间" dataIndex="createTime" key="createTime"
              render={text => {
                return this.format(text)
              }}
            />
            <Column title="操作" key='action'
              render={(text, record) => (
                < span >
                  <Button type="primary" icon='edit' onClick={this.editArticle.bind(this, record)}>修改</Button>
                  <Divider type="vertical" />
                  <Button type="danger" icon='delete' onClick={this.deleteArticle.bind(this, record)}>删除</Button>
                </span >
              )} />
          </Table>
        </div>
      </div>
    )
  }
}

export default Article