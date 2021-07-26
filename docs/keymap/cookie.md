|           |                          |                                          |                                         |
| --------- | ------------------------ | ---------------------------------------- | --------------------------------------- |
| 响应-请求 | set-cookie               | cookie                                   |                                         |
| 生命周期  | max-age                  | expries                                  |                                         |
| 限制      | secure：https            | httpOnly：限制api访问                    |                                         |
| 作用域    | domain：默认不包含子域名 | path：哪些路径接收cookie                 |                                         |
| SameSite  | None                     | Strict、Lax：相同站点，lax允许link时访问 | 确保不与跨域请求一起发送身份验证 cookie |

