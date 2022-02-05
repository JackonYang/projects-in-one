/**
 * @desc    日期相关处理方法
 * @author  crab.xie
 * @date    2018-04-17
 */

module.exports = {
  //日期格式转换为通用格式
  dateSwitchCommon: function(date) {
    var str = date.replace((/-|\./g), "/");
    return str;
  },
  //日期字符串解析
  dateStringParse: function(str) {
    var arr = str.split(/[- : \/]/);
    return arr;
  },
  // 格式化日期 返回年月日 
  FormatDateLack: function(dates) {
    const arr = this.dateToArray(dates);
    const date = arr[0] + "-" + arr[1] + "-" + arr[2];
    return date;
  },
  // 格式化日期 返回年-月-日 hh:mm:ss
  FormatDateFull: function(date) {
    let arr = this.dateToArray(date);
    let str = arr[0] + "-" + arr[1] + "-" + arr[2] + " " + arr[3] + ":" + arr[4] + ":" + arr[5];
    return str;
  },
  // 格式化日期 返回年月日 hh:mm:ss
  FormatTimeFull: function(arr) {
    var date = [];
    date.push(arr[0] + "年" + arr[1] + "月" + arr[2] + "日");
    date.push(arr[3] + ":" + arr[4] + ":" + arr[5]);
    return date;
  },
  // 格式化日期 返回月日 hh:mm
  FormatTimeShort: function(str) {
    let arr = this.dateStringParse(str);
    let date = arr[1] + "-" + arr[2] + " " + arr[3] + ":" + arr[4];
    return date;
  },
  // 把日期分割成数组
  dateToArray: function(dates) {
    const date = new Date(dates);
    var myArray = [];
    myArray[0] = date.getFullYear();
    myArray[1] = date.getMonth() + 1;
    myArray[2] = date.getDate();
    myArray[3] = date.getHours();
    myArray[4] = date.getMinutes();
    myArray[5] = date.getSeconds();
    if (myArray[1] < 10) {
      myArray[1] = "0" + myArray[1];
    };
    if (myArray[2] < 10) {
      myArray[2] = "0" + myArray[2];
    };
    if (myArray[3] < 10) {
      myArray[3] = "0" + myArray[3];
    };
    if (myArray[4] < 10) {
      myArray[4] = "0" + myArray[4];
    };
    if (myArray[5] < 10) {
      myArray[5] = "0" + myArray[5];
    };
    return myArray;
  },
  // 日期24hh
  formatNumber: function(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
  },
  // 格式化日期
  formatTime: function(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  // 返回当天 or 几天后日期数组 
  // @param {number || string} num
  // @param ['yyyy-mm-dd xx:xx:xx','yyyy-mm-dd 23:59:59']
  formatAfterArray: function(num) {
    const costar = [" 00:00:00", " 23:59:59"];
    const start = this.FormatDateFull(new Date());
    let end;
    if (!num) {
      end = curDay + costar[1];
    } else {
      let iosFix = this.dateSwitchCommon(start);
      const sms = Number(new Date(iosFix).getTime());
      const ams = Number(num) * 24 * 60 * 60 * 1000;
      end = this.FormatDateLack(new Date(sms + ams)) + costar[1];
    };
    const arr = [start, end];
    return arr;
  },
  // 返回当天 or 几天前日期数组 
  // @param {number || string} num
  // @param ['yyyy-mm-dd 00:00:00','yyyy-mm-dd 23:59:59']
  formatBeforeArray: function(num) {
    const costar = [" 00:00:00", " 23:59:59"];
    const curDay = this.FormatDateLack(new Date());
    let start = curDay + costar[0];
    let endDay, end;
    if (!num) {
      end = curDay + costar[1];
    } else {
      let iosFix = this.dateSwitchCommon(start);
      const sms = Number(new Date(iosFix).getTime());
      const ams = Number(num) * 24 * 60 * 60 * 1000;
      endDay = this.FormatDateLack(new Date(sms - ams));
      start = endDay + costar[0];
      end = curDay + costar[1];
    }
    const arr = [start, end];
    return arr;
  },
  //秒数格式化
  formatSeconds: function(s) {
    let time = "";
    let reg = RegExp(/:/);
    let state = reg.test(s);
    if (!state) {
      if (s <= 60) {
        if (s < 10) {
          time = "00:0" + s;
        } else {
          time = "00:" + s;
        }
      } else if (s >= 60) {
        let min = Math.floor(s / 60);
        let seconds = s % 60;
        if (min < 10) {
          min = "0" + min;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        time = min + ":" + seconds;
      }
    } else {
      time = s;
    }
    return time;
  },
  // 计算时间差值
  getTimeDifference: function(ms){
    let current = Date.parse(new Date());
    return current - ms;
  }
}
