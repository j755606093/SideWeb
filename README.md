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
| openNativePage | androidPageName,iosPageName,json | jgkj_JSCALLBACK | 打开一个原生页面 |
| getUserInfo | null | null | 获取用户信息 |
| openWxPay | json | json(result:'success|fail',message:'') | 打开微信支付 |

`使用:window.jgkj.loadPageUrl(url);`;

**如果返回值不是立即返回的,比如需要原生执行完成后才返回值,那么需要一个全局函数来接受这个数据和动作,因此做一下约定:**

> 约定一个函数`window.jgkj_JSCALLBACK(action,json)`作为公共回调,此函数接受两个参数,第一个参数一个执行的动作,此动作是api的名称,第二个参数是返回的json数据.比如打开微信支付,原生执行完成后回调:`window.jgkj_JSCALLBACK('openWxPay',{result:'success'})`

## 后台服务器接口

| 链接 | 参数 | 说明 | 其它 |
| ---- | ---- | ----| ---- |
| `http://192.168.31.86/swagger/ui/index.html` | null | APP调用接口文档 | 无 |
| `http://192.168.31.86:8888/swagger/ui/index.html` | null | 后台管理调用接口文档 | 无 |
| `http://gogs-30ff57b9eb.daocloudapp.com/user/login` | null | 内部git外网访问地址 | 无 |
| `http://nginx-app-2fa8b9f5a6.daocloudapp.com` | null | App端API外网访问地址 | 无 |