app1(didnt login)=>sso=>login=>sso write session & sso set cookie=>app1?service-ticket=xxx=>app1-back request sso-back=>set sssion & set jwt



|        | 是什么                     | 服务端                     |
| ------ | -------------------------- | -------------------------- |
| jwt    | 包含了用户信息和加密的数据 | 生成、解析令牌，时间换空间 |
| cookie | sessionId                  | 存取sessionId，空间换时间  |

