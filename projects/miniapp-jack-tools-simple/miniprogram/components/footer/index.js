/* 应用下方新增按钮栏组件 */

Component({
  // footer 组件有两种功能：打开新建待办页面、为待办添加新附件
  properties: {
    addFile: Boolean,
    // 如用于添加新附件，需传入待办记录 _id 值
    _id: String
  },
  methods: {
    onClick() {
      if (this.properties.addFile) {
        this.addFile()
      } else {
        wx.navigateTo({
          url: '../../pages/add/index',
        })
      }
    },

    // 新增附件
    async addFile() {
      const db = await getApp().database()
      // 获取当前待办信息
      db.collection(getApp().globalData.collection).where({
        _id: this.properties._id
      }).get().then(res => {
        const {
          data: [todo]
        } = res
        // 限制上传文件个数
        if (todo.files.length + 1 > getApp().globalData.fileLimit) {
          wx.showToast({
            title: '数量达到上限',
            icon: 'error',
            duration: 2000
          })
          return
        }
        try {
          // 从会话选择文件
          wx.chooseMessageFile({
            count: 1
          }).then(res => {
            const file = res.tempFiles[0]
            // 上传文件至云存储
            getApp().uploadFile(file.name, file.path).then(res => {
              // 添加文件记录
              todo.files.push({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2),
                id: res.fileID
              })
              db.collection('todo').where({
                _id: this.properties._id
              }).update({
                data: {
                  files: todo.files
                }
              })
              // 返回并提示操作成功
              wx.navigateBack({
                delta: 0,
              })
              wx.showToast({
                title: '文件已添加',
                icon: 'success',
                duration: 2000
              })
            })
          })
        } catch {
          console.error('【选取文件失败】', e.toString())
        }
      })
    }
  }
})