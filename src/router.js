import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './container/home'
class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <BrowserRouter>
        <Route path='/' component={Home}></Route>
      </BrowserRouter>
    )
  }
}
export default Router