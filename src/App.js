import React from 'react';
import './App.scss';
// import Router from './router';
import LeftMenu from './components/LeftMenu'
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

function App() {
    return (
        <Layout className='layout'>
            <Sider>
                <div className='sider-title'>后台管理系统</div>
                <LeftMenu></LeftMenu>
            </Sider>
            <Layout>
                <Header className='header'>Header</Header>
                <Content>Content</Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>
        // <div className="App">
        //   <Router></Router>
        // </div>
    );
}

export default App;