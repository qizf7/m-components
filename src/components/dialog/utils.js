/**
 * 生成唯一8位ID
 * @type {[type]}
 */
exports.uniqueId = (function () {
  const ids = [];
  return function () {
    let id = Math.random().toString(36).slice(-8);
    if(ids.indexOf(id) < 0){
      ids.push(id);
      return id;
    }else{
      return uniqueId()
    }
  };
})();

/**
 * 将一个字符串添加到所有选择器后
 * @param  {[type]} style [description]
 * @param  {[type]} str   [description]
 * @param  {[type]} bloon   [description]
 * @return {[type]}       [description]
 */
exports.appendToSelector = function (style, str, toTail) {
  if(typeof style === 'string'){
    let reg = /[^}]+[\s]*?(?=\s*\{[\s\S]*)/gm;
    if(toTail){
      return style.replace(reg, match => `${match.trim()}${str}`)
    }
    return style.replace(reg, match => `${str}${match.trim()}`)
  }else{
    throw 'please pass in style sheet string'
  }
}

/**
 * 将一个字符串
 * @param  {[type]} style [description]
 * @param  {[type]} str   [description]
 * @return {[type]}       [description]
 */
exports.preAppendToSelector = function (style, str) {
  if(typeof style === 'string'){
    let reg = /[^}]+[\s]*?(?=\s*\{[\s\S]*)/gm;
    return style.replace(reg, match => match.trim() + `[${str}]`)
  }else{
    throw 'please pass in style sheet string'
  }
}
