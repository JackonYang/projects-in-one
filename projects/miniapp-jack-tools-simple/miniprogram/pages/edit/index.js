/* 待办重新编辑页面 */

Page({
  // 类似 add 页面，存储正在编辑的待办信息
  data: {
    _id: '',
    title: '',
    desc: '',
    files: [],
    fileName: '',
    freqOptions: ['未完成', '已完成'],
    freq: 0
  },

  async onLoad(options) {
    // 根据上一页传来的 _id 值更新表单数据
    if (options.id !== undefined) {
      this.setData({
        _id: options.id
      })
      const db = await getApp().database()
      // 根据待办 _id 加载信息
      db.collection(getApp().globalData.collection).where({
        _id: this.data._id
      }).get().then(res => {
        // 解包获得 todo 对象
        const {
          data: [todo]
        } = res
        // 循环拼接展示的文件列表名，文件名过长时截断
        let fileName = ''
        for (let file of todo.files) {
          fileName += file.name.substr(0, 10) + (file.name.length > 10 ? "..." : "") + " "
        }
        // 如果整体文件名字符串过长则整体截断
        fileName = fileName.substr(0, 20) + (fileName.length > 20 ? "..." : "")
        // 更新页面显示
        this.setData({
          title: todo.title,
          desc: todo.desc,
          files: todo.files,
          fileName,
          freq: todo.freq
        })
      })
    }
  },

  //输入响应函数
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },

  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  // 添加文件附件
  addFile() {
    // 如果文件过多则进行提示
    if (this.data.files.length + 1 > getApp().globalData.fileLimit) {
      wx.showToast({
        title: '数量达到上限',
        icon: 'error',
        duration: 2000
      })
    }
    // 调用接口选择文件
    wx.chooseMessageFile({
      count: 1
    }).then(res => {
      // 将选择结果中的临时文件上传到云存储
      const file = res.tempFiles[0]
      getApp().uploadFile(file.name, file.path).then(res => {
        // 存储已上传的文件名、文件大小及其 id
        this.data.files.push({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          id: res.fileID
        })
        // 更新显示
        this.setData({
          files: this.data.files,
          fileName: this.data.fileName + file.name + ' '
        })
      })
    })
  },

  // 表单、跳转响应函数
  onChooseFreq(e) {
    this.setData({
      freq: e.detail.value
    })
  },

  // 删除待办事项
  async deleteTodo() {
    const db = await getApp().database()
    // 根据待办 _id 删除待办事项
    db.collection(getApp().globalData.collection).where({
      _id: this.data._id
    }).remove()
    // 删除完成后，退回首页
    wx.navigateBack({
      delta: 2,
    })
  },

  cancelEdit() {
    wx.navigateBack({
      delta: 0,
    })
  },

  // 保存待办信息
  async saveTodo() {
    // 对输入框内容进行校验
    if (this.data.title === '') {
      wx.showToast({
        title: '事项标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.title.length > 10) {
      wx.showToast({
        title: '事项标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: '事项描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    const db = await getApp().database()
    // 校验通过后，根据待办 _id，更新待办信息
    db.collection(getApp().globalData.collection).where({
      _id: this.data._id
    }).update({
      data: {
        title: this.data.title,
        desc: this.data.desc,
        files: this.data.files,
        freq: Number(this.data.freq)
      }
    }).then(() => {
      // 待办更新后，返回详情页
      wx.navigateBack({
        delta: 0,
      })
    })
  }
})