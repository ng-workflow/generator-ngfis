## <%= name %> - <%= description %>

  - 生产环境: 
  - 源码地址: <%= repository %>

### 初始化
  - 安装工具: `npm install ngfis -g`
  - 安装依赖: `ngfis install`

### 常用指令
  - 开发: `ngfis release -wL`
  - 服务: `ngfis server start`
  - 打包:
    - `ngfis publish` 发布到 ../dist/{name}.{version}.{buildDate}.zip
    - `ngfis publish -d local` 发布到 ../dist 目录
    - `ngfis publish -d ../dist,zip` 同时执行以上两者
    - `ngfis publish -f ../dist/test.zip` 发布到指定文件名

### Tip
  - 注意源码目录下不要有`node_modules`, 否则编译速度很慢.