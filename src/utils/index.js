/**
 * 生成5位随机字符串，放在前端的登录、修改密码里面。传给后端加密干扰项。
 */
export const MathRand = () => {
  let Num = "";
  let pos = 0;
  let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];
  for (var i = 0; i < 5; i++) {
    pos = Math.round(Math.random() * (arr.length - 1));
    Num += arr[pos];
  }
  return Num
}

/**
 * 写cookies
 * @param {*} name 属性名
 * @param {*} value  属性值
 */
export const setCookie = (name, value) => {
  var Days = 7;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/**
 * 读取cookies
 * @param {*} name 属性名
 */
export const getCookie = (name) => {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}

/**
 * 删除cookies
 * @param {*} name 属性名
 */
export const delCookie = (name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/**
 * 根据key获取localStorage的值
 * @param {string} name localStorage中存储的key
 * @returns { any } 找到就返回，未找到就返回undefined
 */
export const getStorageItem = (name) => {
  if (!name) return
  const value = window.localStorage.getItem(name)
  return value && value !== 'undefined' && JSON.parse(value)
}
/**
 * 将value以key为键保存到localStorage中
 * @param { string } name 存储到localStorage的key
 * @param { any } value 存储到localStorage的value
 * @returns { void }
 */
export const setStorageItem = (name, value) => {
  if (!name) return
  return window.localStorage.setItem(name, JSON.stringify(value))
}
/**
 * 删除localStorage
 * @param {string} name 删除localStorage中对应的key
 */
export const removeStorageItem = (name) => {
  if (!name) return
  return window.localStorage.removeItem(name)
}
/**
 * 清空localStorage
 */
export const clearStorage = () => window.localStorage.clear()
/**
 * 清空sessionStorage
 */
export const clearSessionStorage = () => window.sessionStorage.clear()

// 检测浏览器内核
export const getBrowserType = () => {
  if (navigator.userAgent.indexOf('Trident') !== -1) {
    return 'IE'
  } else if (navigator.userAgent.indexOf('Presto') !== -1) {
    return 'OPERA'
  } else if (navigator.userAgent.indexOf('AppleWebKit') !== -1 && navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'WEBKIT'
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'FIREFOX'
  } else if (navigator.userAgent.indexOf('AppleWebKit') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
    return 'SAFARI'
  }
}

// 获取本日日期
export const getDateByType = (type) => {
  function getDay(day) { // 7天计算
    const today = new Date()
    const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
    today.setTime(targetday_milliseconds) // 注意，这行是关键代码
    const tYear = today.getFullYear()
    let tMonth = today.getMonth()
    let tDate = today.getDate()
    tMonth = doHandleMonth(tMonth + 1)
    tDate = doHandleMonth(tDate)
    return `${tYear}-${tMonth}-${tDate}`
  }

  function doHandleMonth(month) {
    let m = month
    if (month.toString().length == 1) {
      m = `0${month}`
    }
    return m
  }

  const d = null
  let dateArr = []
  const zero = '0'
  const dd = new Date()
  const oneDayTime = 24 * 60 * 60 * 1000

  //  获取时间范围
  const y = dd.getFullYear()
  const m = (dd.getMonth() + 1) < 10 ? `0${dd.getMonth() + 1}` : (dd.getMonth() + 1)
  const r = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate()
  const date = (new Date(dd - (dd.getDay() - 1) * 86400000)).getDate()
  const currentSaDay = date < 10 ? `0${date}` : date

  switch (type) {
    case 'today':
      dateArr = [`${y}-${m}-${r} 00:00:00`, `${y}-${m}-${r} 23:59:59`]
      break
    case 'week':
      dateArr = [`${y}-${m}-${currentSaDay}`, `${y}-${m}-${r}`]
      break
    case '7days':
      dateArr = [`${getDay(-7)} 00:00:00`, `${y}-${m}-${r} 23:59:59`]
      break
    case 'month':
      dateArr = [`${dd.getFullYear()}-${m}-01`, `${y}-${m}-${r}`]
      break
    case 'year':
      dateArr = [`${dd.getFullYear() - 1}-01-01`, `${y}-${m}-${r}`]
      break
    default:
      dateArr = [`${dd.getFullYear() - 1}-12-26`, `${y}-${m}-${r}`]
      break
  }
  return dateArr
}

//导出excel表
export const exportExcel = (res, fileName) => {
  const s = fileName
  const newString = s.substring(0, s.lastIndexOf('.')) + new Date().getTime() + s.substring(s.lastIndexOf('.'))
  fileName = newString
  // console.log(res)
  const blob = new Blob([res])
  const objectUrl = URL.createObjectURL(blob)
  // 兼容IE
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    navigator.msSaveBlob(blob, fileName)
  } else {
    const elink = document.createElement('a')
    elink.download = fileName
    elink.target = '_blank'
    elink.style.display = 'none'
    elink.href = objectUrl
    // console.log(elink)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  }
}