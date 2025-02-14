# [am-cf-sub-rss](https://github.com/amclubs/am-cf-sub-rss)
通过Cloudflare Workers &amp; Pages 搭建，将你任意节点与多个订阅聚合成专属于你的订阅链接,完成定制汇聚订阅

#
▶️ **新人[YouTube](https://youtube.com/@am_clubs?sub_confirmation=1)** 需要您的支持，请务必帮我**点赞**、**关注**、**打开小铃铛**，***十分感谢！！！*** ✅
</br>🎁请 **follow** 我的[GitHub](https://github.com/amclubs)、给我所有项目一个 **Star** 星星（拜托了）！你的支持是我不断前进的动力！ 💖
</br>✅**解锁更多技能** [加入TG群【am_clubs】](https://t.me/am_clubs)、[YouTube频道【@am_clubs】](https://youtube.com/@am_clubs?sub_confirmation=1)、[【博客(国内)】](https://amclubss.com)、[【博客(国际)】](https://amclubs.blogspot.com) 
</br>✅点击观看教程[CLoudflare免费节点](https://www.youtube.com/playlist?list=PLGVQi7TjHKXbrY0Pk8gm3T7m8MZ-InquF) | [VPS搭建节点](https://www.youtube.com/playlist?list=PLGVQi7TjHKXaVlrHP9Du61CaEThYCQaiY) | [获取免费域名](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR) | [免费VPN](https://www.youtube.com/playlist?list=PLGVQi7TjHKXY7V2JF-ShRSVwGANlZULdk) | [IPTV源](https://www.youtube.com/playlist?list=PLGVQi7TjHKXbkozDYVsDRJhbnNaEOC76w) | [Mac和Win工具](https://www.youtube.com/playlist?list=PLGVQi7TjHKXYBWu65yP8E08HxAu9LbCWm) | [AI分享](https://www.youtube.com/playlist?list=PLGVQi7TjHKXaodkM-mS-2Nwggwc5wRjqY)


# 定制聚合订阅 
## Pages 部署方法 [视频教程](https://youtu.be/YBO2hf96150)
### 1. 部署 Cloudflare Pages：
   - 在 Github 上先 Fork 本项目，并点上 Star !!!
   - 在 Cloudflare Pages 控制台中选择 `连接到 Git`后，选中 `am-cf-sub-rss`项目后点击 `开始设置`。

### 2. 给 Pages绑定 自定义域：
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `fuck.google.com`，则添加自定义域填入 `sub.fuck.google.com`即可；
   - 按照 Cloudflare 的要求将返回你的域名DNS服务商，添加 该自定义域 `sub`的 CNAME记录 `am-cf-sub-rss.pages.dev` 后，点击 `激活域`即可。

### 3. 修改 快速订阅入口 ：

  例如您的pages项目域名为：`sub.fuck.google.com`；
   - 添加 `TOKEN` 变量，快速订阅访问入口，默认值为: `auto` ，获取订阅器默认节点订阅地址即 `/auto` ，例如 `https://sub.fuck.google.com/auto`

### 4. 添加你的节点和订阅链接：
   - 添加 `SUB` 变量，节点相关配置连接，确保每行一个链接，例如：
   ```
   vless://866853eb-5293-4f09-bf00-e13eb237c655@icook.tw:443?encryption=none&security=tls&sni=worker.amcloud.filegear-sg.me&fp=random&type=ws&host=worker.amcloud.filegear-sg.me#t.me%2FAM_CLUBS vless://866853eb-5293-4f09-bf00-e13eb237c655@visa.com:443?encryption=none&security=tls&sni=worker.amcloud.filegear-sg.me&fp=random&type=ws&host=worker.amcloud.filegear-sg.me#youtube.com%2F%40AM_CLUB
   ```
   - 添加 `SUB_LINK` 变量，添加你的自建节点链接和机场订阅链接，确保每行一个链接，例如：
   ```
   https://trojan.amcloud.filegear-sg.me/auto
   https://worker.amcloud.filegear-sg.me/bestip/866853eb-5293-4f09-bf00-e13eb237c655?uuid=866853eb-5293-4f09-bf00-e13eb237c655
   ```

## Workers 部署方法
### 1. 部署 Cloudflare Worker：

   - 在 Cloudflare Worker 控制台中创建一个新的 Worker。
   - 将 [worker.js](https://github.com/amclubs/am-cf-sub-rss/blob/main/_worker.js)  的内容粘贴到 Worker 编辑器中。


### 2. 修改 订阅入口 ：

  例如您的workers项目域名为：`sub.am.workers.dev`；
   - 通过修改 `mytoken` 赋值内容，达到修改你专属订阅的入口，避免订阅泄漏。
     ```
     let mytoken = 'auto';
     ```
     如上所示，你的订阅地址则如下：
     ```url
     https://sub.am.workers.dev/auto
     或
     https://sub.am.workers.dev/?token=auto
     ```


### 3. 添加你的节点或订阅链接：

**3.1 修改 MainData 参数示例**

 - 修改 `mainData` 参数添加你的自建节点，例如：
   
	```js
	const mainData = `
	vless://866853eb-5293-4f09-bf00-e13eb237c655@icook.tw:443?encryption=none&security=tls&sni=worker.amcloud.filegear-sg.me&fp=random&type=ws&host=worker.amcloud.filegear-sg.me#t.me%2FAM_CLUBS 
	vless://866853eb-5293-4f09-bf00-e13eb237c655@visa.com:443?encryption=none&security=tls&sni=worker.amcloud.filegear-sg.me&fp=random&type=ws&host=worker.amcloud.filegear-sg.me#youtube.com%2F%40AM_CLUB
	`
	```
注意！`mainData`参数的特殊引号必须保留，否则代码异常。



 **3.2 修改 urls 参数示例**
 
 - 修改 `urls` 参数，在脚本中设置 `urls` 变量为 你的订阅链接 的 URL。例如：

	```js
	const urls = [
		'https://trojan.amcloud.filegear-sg.me/auto',
 		'https://hy2sub.pages.dev',
	];
	```
注意！订阅链接内容必须为`base64`格式。


## 变量说明
| 变量名 | 示例 | 必填 | 备注 | YT |
|-----|-----|-----|-----|-----|
| TOKEN         | auto                                  |❌| 你专属订阅的入口，避免订阅泄漏                      | |
| SUB           | vless://b7a39... vmess://ew0K...      |❌| 节点相关配置连接，确保每行一个链接        | |
| SUB_LINK      | https://sub...                        |❌| 添加你的自建节点链接和机场订阅链接，确保每行一个链接          | |
| SUB_CONFIG    | [https://raw.github.../ACL4SSR_Online_Mini.ini](https://raw.githubusercontent.com/amclubs/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini) |❌| clash、singbox等 订阅转换配置文件  | |
| SUB_CONVERTER | https://url.v1.mk                     |❌| clash、singbox等 订阅转换后端的api地址                               | |
| SUB_NAME      | @AM_CLUB                              |❌| 订阅名称                                                     | |
| TG_TOKEN      | 6894123456:XXXXXXXXXX0qXXXXqWXgBA     |❌| 发送TG通知的机器人token                       | |
| TG_ID         | 6946912345                            |❌| 接收TG通知的账户数字ID                                       | |


## 注意事项
项目中，TG_TOKEN和TG_ID在使用时需要先到Telegram注册并获取。其中，TG_TOKEN是telegram bot的凭证，TG_ID是用来接收通知的telegram用户或者组的id。


# 
<center>
<details><summary><strong> [点击展开] 赞赏支持 ~🧧</strong></summary>
*我非常感谢您的赞赏和支持，它们将极大地激励我继续创新，持续产生有价值的工作。*

- **USDT-TRC20:** `TWTxUyay6QJN3K4fs4kvJTT8Zfa2mWTwDD`
- **TRX-TRC20:** `TWTxUyay6QJN3K4fs4kvJTT8Zfa2mWTwDD`

<div align="center"> 
  <img src="https://github.com/user-attachments/assets/e6cdc42a-6374-4722-b833-601738f72196" width="200"></br> 
  TRC10/TRC20扫码支付 
</div> 
</details>
</center>

 #
 免责声明:
 - 1、该项目设计和开发仅供学习、研究和安全测试目的。请于下载后 24 小时内删除, 不得用作任何商业用途, 文字、数据及图片均有所属版权, 如转载须注明来源。
 - 2、使用本程序必循遵守部署服务器所在地区的法律、所在国家和用户所在国家的法律法规。对任何人或团体使用该项目时产生的任何后果由使用者承担。
 - 3、作者不对使用该项目可能引起的任何直接或间接损害负责。作者保留随时更新免责声明的权利，且不另行通知。
 
