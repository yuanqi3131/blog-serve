/**
 * @description 接口的统一定义
 */
import { get, post, put, del } from './http';
export const reqLogin = (obj) => post('/login', obj);
export const reqRegister = (obj) => post('/register', obj);
export const reqAddArticle = (obj) => post('/article', obj);
export const reqTagList = () => get('/tag');
export const reqAddTag = (name) => post('/tag', { name });
export const reqUpdateTag = (obj) => put('/tag', obj);
export const reqDeleteTag = (id) => del('/tag', { id });
export const reqArticleList = (id) => get('/article', { id });
export const reqDeleteArticle = (id) => del('/article', { id });
export const reqUserList = () => get('/user');
export const reqDeleteUser = (id) => del('/user', { id });
export const reqRoleList = () => get('/role');
export const reqAddRole = (obj) => post('/role', obj);
export const reqDeleteRole = (id) => del('/role', { id });
export const reqAddUserRole = (obj) => post('/userRole', obj);
export const reqMenuList = () => get('/menu');
export const reqAddMenu = (obj) => post('/menu', obj);
export const reqDeleteMenu = (id) => del('/menu', { id });
export const reqEditMenu = (obj) => put('/menu', obj);
export const reqCreateRoleMenu = (obj) => post('/roleMenu', obj);
export const reqRoleMenu = (id) => get(`/roleMenu?id=${id}`);
export const reqGetMenu = (id) => get(`/getMenu?id=${id}`);