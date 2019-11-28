import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/home';
import ArticleList from './pages/article';
import AddArticle from './pages/article/add';
import Logs from './pages/system/logs';
import Tag from './pages/tag';
import User from './pages/user';
import Role from './pages/user/role';
import Menu from './pages/user/menu';
class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Switch>
        <Route path='/' exact component={Home}></Route>
        <Route path='/article/list' component={ArticleList}></Route>
        <Route path='/article/add' component={AddArticle}></Route>
        <Route path='/tag' component={Tag}></Route>
        <Route path='/system/logs' component={Logs}></Route>
        <Route path='/user/index' component={User}></Route>
        <Route path='/user/role' component={Role}></Route>
        <Route path='/user/menu' component={Menu}></Route>
      </Switch>
    )
  }
}
export default Router