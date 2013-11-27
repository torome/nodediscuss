/**
 * 路由配置
 * @author  heroic
 */

/**
 * Module dependencies
 */
var auth = require('./authorization'),
  api = require('../api'),
  controllers = require('./controllers'),
  uploadCtrl = controllers.upload,
  userCtrl = controllers.user,
  topicCtrl = controllers.topic,
  commentCtrl = controllers.comment,
  notificationCtrl = controllers.notification;
var noopRequestHandler = function(req, res, next) {};

module.exports = exports = function(app) {
  // 上传文件
  app.post('/upload/image',
      auth.authRequired, uploadCtrl.uploadImage);

  app.get('/', topicCtrl.list);

  // 用户相关的路由配置
  app.all('/signup', auth.unreachableWhenAuthorized);
  app.get('/signup', userCtrl.signup);
  app.post('/signup', userCtrl.signup);

  app.all('/signin', auth.unreachableWhenAuthorized);
  app.get('/signin', userCtrl.signin);
  app.post('/signin', userCtrl.signin);

  app.post('/logout', auth.authRequired, userCtrl.logout);
  app.get('/active', userCtrl.activate);
  app.get('/user/:username', userCtrl.get);

  app.all('/settings', auth.authRequired);
  app.get('/settings', userCtrl.settings);
  app.post('/settings', userCtrl.settings);

  // 话题相关的路由配置
  app.all('/topic/create', auth.authRequired);
  app.get('/topic/create', topicCtrl.create);
  app.post('/topic/create', topicCtrl.create);

  app.get('/tag/:name', topicCtrl.queryByTag);  // 该节点下的所有话题
  app.get('/topics', topicCtrl.list);
  app.get('/topic/:id', topicCtrl.get);  // 详细话题页面

  app.all('/topic/:id/*', auth.authRequired);
  app.get('/topic/:id/edit', auth.isTopicAuthor, topicCtrl.edit); // 话题编辑页面
  app.post('/topic/:id/edit', auth.isTopicAuthor, topicCtrl.edit);  // 更新话题
  app.post('/topic/:id/del', noopRequestHandler);  // 删除话题
  app.post('/topic/:id/favorite', api.requestHandler(api.topic.favorite));
  app.post('/topic/:id/del_favorite', api.requestHandler(api.topic.removeFavorite));

  // 评论相关的路由配置
  app.all('/comment/*', auth.authRequired);
  app.post('/comment/create', commentCtrl.create);
  app.post('/comment/:id/del', api.requestHandler(api.comment.remove));  // 删除评论

  // 通知相关的路由配置
  app.get('/notifications',
      auth.authRequired, notificationCtrl.index);  // 查看通知的页面

  // 单一文档页面的路由
  // app.get('/:slug', noopRequestHandler);
};