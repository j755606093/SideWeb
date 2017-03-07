# SideWeb

## 启动服务

> 暂时未开启生产服务器.

输入命令启动测试服务器:`npm start`.

## APP中的web页面(测试)

| 链接 | 参数 | 说明 | 其它 |
| ---- | ---- | ----| ---- |
| `http://192.168.31.116:3000/getHomeContent` | null | APP首页内容 | 无 |
| `http://192.168.31.116:3000/getTopic?uniqueId=a9fc5fb8b7e2748f0954f27bc8703bd1` | uniqueId | APP分享微信公众号文章页测试地址 | uniqueId是公众号文章id |
| `http://192.168.31.116:3000/getCustomPage?page=postdetail&postid=1` | postdetail,postid | APP分享文章页测试 | postdetail:页面名;postid:文章id |

## APP提交接口列表

| api | 参数 | 返回值 | 说明 |
| ---- | ---- | ----| ---- |
| getAllApi | null | Object | 获取所有的可用api. |
| loadPageUrl | url | null | 打开一个网页 |
| openNativePage | androidPageName,iosPageName,json | null | 打开一个原生页面 |
| getUserInfo | null | null | 获取用户信息 |

`使用:jgkj.loadPageUrl(url);`

## 后台服务器接口

| 链接 | 参数 | 说明 | 其它 |
| ---- | ---- | ----| ---- |
| `http://192.168.31.86/swagger/ui/index.html` | null | APP调用接口文档 | 无 |
| `http://192.168.31.86:8888/swagger/ui/index.html` | null | 后台管理调用接口文档 | 无 |
| `http://gogs-30ff57b9eb.daocloudapp.com/user/login` | null | 内部git外网访问地址 | 无 |
| `http://nginx-app-2fa8b9f5a6.daocloudapp.com` | null | App端API外网访问地址 | 无 |