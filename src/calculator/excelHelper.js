/* eslint-disable */

import * as XLSX from 'xlsx/xlsx.mjs'
/**
 * @description:
 * @param {Object} data 服务端发过来的数据
 * @param {String} name 导出Excel文件名字
 * @return:
 */
export function exportExcel(data, name) {
  /* convert state to workbook */
  let res = [['基础材料']]
  for (const i in data['IngredientList']) {
    const el = data['IngredientList'][i]
    res.push([el['name'], el['amount']])
  }

  console.log(res)
  const ws = XLSX.utils.aoa_to_sheet(res)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS')
  /* generate file and send to client */
  XLSX.writeFile(wb, name + '.xlsx')
}

/**
 * @description: 导入excel文件并返回数据
 * @param {function} 回调函数参数data,dataRef,一个是数据，一个是exce表单的索引
 * @return:
 */
export function importExcel(callback) {
  var inputObj = document.createElement('input')
  inputObj.setAttribute('id', 'file')
  inputObj.setAttribute('type', 'file')
  inputObj.setAttribute('name', 'file')
  inputObj.setAttribute('style', 'visibility:hidden')
  inputObj.setAttribute('accept', '.xlsx,.xls,.csv')
  inputObj.addEventListener('change', (evt) => {
    const files = evt.target.files
    if (files && files[0])
      _file(files[0], (data, dataRef) => {
        callback(data, dataRef)
      })
  })
  document.body.appendChild(inputObj)
  inputObj.value
  inputObj.click()
}

/**
 * @description: 处理文件
 * @param {Object} file 文件对象
 * @param {function} callback 回调函数
 * @return:
 */
function _file(file, callback) {
  const make_cols = (refstr) =>
    Array(XLSX.utils.decode_range(refstr).e.c + 1)
      .fill(0)
      .map((x, i) => ({
        name: XLSX.utils.encode_col(i),
        key: i
      }))

  /* Boilerplate to set up FileReader */
  const reader = new FileReader()
  reader.onload = (e) => {
    /* Parse data */
    const bstr = e.target.result
    const wb = XLSX.read(bstr, {
      type: 'binary'
    })
    /* Get first worksheet */
    const wsname = wb.SheetNames[0]
    const ws = wb.Sheets[wsname]
    /* Convert array of arrays */
    const data = XLSX.utils.sheet_to_json(ws, {
      header: 1
    })
    /* Update state */
    callback(data, make_cols(ws['!ref']))
  }
  reader.readAsBinaryString(file)
}

/**
 * @description: 获取map的长度
 * @param {Object} obj map对象
 * @return: map的长度
 */
function getLength(obj) {
  var count = 0
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      count++
    }
  }

  return count
}
