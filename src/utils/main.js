import {
  skins,
  skinPath,
  levels,
  cellWidth
} from './config'

const COVER = new Image() // 封面
const FLAG = new Image() // 旗帜
const MINE = new Image() // 地雷
const BOOM = new Image() // 触雷

let mineArray = [] // 实际状态数组，0-9，其中 0-8 表示周边雷的数量，9 表示自身为雷
let showArray = [] // 显示数组，0-cover，1-flag，2-mine，3-boom，4-number，5-background（空白）

let restMines = 0 // 剩下的雷数量
let restMinesShow = 0 // 剩下的雷数量（显示）

/**
 * 开始游戏
 * @param {object} ctx 
 * @param {string} skin 
 * @param {string} level 
 * @returns {object} { size: { width, height }, mines }
 */
export const initGame = (ctx, skin, level) => {
  const res = {}
  const _level = levels.find(item => item.key === level)
  // 重置地雷数量
  res.mines = restMines = restMinesShow = _level.mines
  // 重置数组
  mineArray = arrayReset(_level.cells)
  showArray = arrayReset(_level.cells)
  // 计算尺寸
  res.size = calcStageSize(skin)

  ctx.canvas.width = res.size.width
  ctx.canvas.height = res.size.height
  // 重绘
  fullDraw(ctx, skin, res.size)
  return res
}

/**
 * 左键点击
 * @param {Event} e 
 * @param {object} ctx 
 * @param {string} skin 
 * @param {string} level 
 */
export const onClick = (e, ctx, skin, level) => {
  const cell = whichCell(e, skin)
  if (cell.x === null || cell.y === null) return false
  // 如果没有一个翻开的，就是第一次点击
  if (showArray.every(row => row.every(cell => cell === 0))) {
    mineArrayGenerate(level, cell)
  }
  return flip(cell, ctx, skin, level)
}

/**
 * 右键点击
 * @param {Event} e 
 * @param {object} ctx 
 * @param {string} skin 
 * @param {string} level 
 */
export const onContentMenu = (e, ctx, skin, level) => {
  const cell = whichCell(e, skin)
  if (cell.x === null || cell.y === null) return false
  return rightClick(cell, ctx, skin, level)
}

/**
 * 加载图片
 * @param {string} skin 皮肤
 */
export const skinLoader = (skin) => {
  return new Promise((resolve, reject) => {
    COVER.src = `${skinPath}${skin}/cover.png`
    FLAG.src = `${skinPath}${skin}/flag.png`
    MINE.src = `${skinPath}${skin}/mine.png`
    BOOM.src = `${skinPath}${skin}/boom.png`
    let num = 0;
    [COVER, FLAG, MINE, BOOM].map(item => {
      item.onload = () => {
        num++
        if (num >= 4) {
          resolve([COVER, FLAG, MINE, BOOM])
        }
      }
      item.onerror = () => {
        reject()
      }
    })
  })
}

/**
 * 计算点击的哪一个格子
 * @param {Event} e 
 * @param {string} skin 
 */
export const whichCell = (e, skin) => {
  const _skin = skins.find(item => item.key === skin)
  const cell = getCursorPosition(e)
  const step = cellWidth + _skin.lineWidth;
  if ((cell.x % step < _skin.lineWidth) || (cell.y % step < _skin.lineWidth)) {
    cell.x = null
    cell.y = null
  } else {
    cell.x = Math.floor(cell.x / step);
    cell.y = Math.floor(cell.y / step);
  }
  return cell;
}

/**
 * 获取 canvas 上点击位置
 * @param {Event} e 
 */
export const getCursorPosition = (e) => {
  const position = new Object()
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect()
  position.x = e.clientX - rect.left
  position.y = e.clientY - rect.top
  return position;
}

/**
 * 计算游戏区域尺寸
 * @param {string} skin 皮肤
 * @returns {object} {width: 1, height: 1}
 */
export const calcStageSize = (skin) => {
  const _skin = skins.find(item => item.key === skin)

  const width = _skin.lineWidth * (showArray[0].length + 1) + cellWidth * showArray[0].length
  const height = _skin.lineWidth * (showArray.length + 1) + cellWidth * showArray.length

  return {
    width,
    height
  }
}

/**
 * 重置数组
 * @param {array} cells 方格数量
 */
export const arrayReset = (cells) => {
  const array = []
  for (let i = 0; i < cells[1]; i++) {
    array[i] = new Array(cells[0]).fill(0)
  }
  return array
}

/**
 * canvas 整体重绘
 * @param {object} ctx 绘图上下文
 * @param {string} skin 皮肤
 * @param {object} size 显示区宽高
 */
export const fullDraw = (ctx, skin, size) => {
  const _skin = skins.find(item => item.key === skin)
  // 设置绘图样式
  ctx.lineWidth = _skin.lineWidth
  ctx.strokeStyle = _skin.lineColor
  ctx.beginPath()
  // 绘制线条
  for (let y = 0; y <= showArray.length; y++) {
    const tempY = _skin.lineWidth * (y + 1) + cellWidth * y - _skin.lineWidth / 2
    ctx.moveTo(0, tempY)
    ctx.lineTo(size.width, tempY)
  }
  for (let x = 0; x <= showArray[0].length; x++) {
    const tempX = _skin.lineWidth * (x + 1) + cellWidth * x - _skin.lineWidth / 2
    ctx.moveTo(tempX, 0)
    ctx.lineTo(tempX, size.height)
  }
  ctx.stroke();
  // 绘制方格
  for (let y = 0; y < showArray.length; y++) {
    for (let x = 0; x < showArray[0].length; x++) {
      drawCell({
        x,
        y
      }, ctx, _skin)
    }
  }
}

/**
 * 绘制方格
 * @param {object} cell {x, y}
 * @param {object} ctx 
 * @param {object} _skin 皮肤
 */
export const drawCell = (cell, ctx, _skin) => {
  const {
    x,
    y
  } = cell
  const step = _skin.lineWidth + cellWidth
  const xPx = x * step + _skin.lineWidth
  const yPx = y * step + _skin.lineWidth

  ctx.fillStyle = _skin.background;
  ctx.font = `bold ${cellWidth * 0.625}px ${_skin.numberFontFamily}`
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  switch (showArray[y][x]) {
    case 0:
      // cover
      ctx.drawImage(COVER, xPx, yPx, cellWidth, cellWidth);
      break;
    case 1:
      // flag
      ctx.drawImage(FLAG, xPx, yPx, cellWidth, cellWidth);
      break;
    case 2:
      // mine
      ctx.drawImage(MINE, xPx, yPx, cellWidth, cellWidth);
      break;
    case 3:
      // boom
      ctx.drawImage(BOOM, xPx, yPx, cellWidth, cellWidth);
      break;
    case 4:
      // number
      ctx.fillRect(xPx, yPx, cellWidth, cellWidth);
      ctx.fillStyle = _skin.numberColor;
      ctx.fillText(mineArray[y][x], xPx + cellWidth / 2, yPx + cellWidth / 2);
      break;
    case 5:
      // background
      ctx.fillRect(xPx, yPx, cellWidth, cellWidth);
      break;
  }
}

/**
 * 生成地雷
 * @param {string} level 难度
 * @param {object} cell 不生成雷的方格--第一次点击的方格，不能第一次点击就失败
 */
export const mineArrayGenerate = (level, cell) => {
  const _level = levels.find(item => item.key === level)
  // 生成雷
  for (let i = 0; i < _level.mines;) {
    const x = Math.ceil(Math.random() * _level.cells[0]) - 1
    const y = Math.ceil(Math.random() * _level.cells[1]) - 1
    // 如果已经是雷，或者不可以生成雷，跳过
    if ((9 === mineArray[y][x]) || (cell.x === x && cell.y === y)) {
      continue;
    }
    mineArray[y][x] = 9;
    i++;
  }
  //计算雷周围数据
  for (let y = 0; y < _level.cells[1]; y++) {
    for (let x = 0; x < _level.cells[0]; x++) {
      // 如果是雷，跳过
      if (9 === mineArray[y][x]) {
        continue;
      }
      // 周边八个方格累加
      for (let position = 0; position < 8; position++) {
        switch (position) {
          case 0:
            if (0 === y || 0 === x) {
              break;
            } else if (9 === mineArray[y - 1][x - 1]) {
              mineArray[y][x]++;
            }
            break;
          case 1:
            if (0 === y) {
              break;
            } else if (9 === mineArray[y - 1][x]) {
              mineArray[y][x]++;
            }
            break;
          case 2:
            if (0 === y || _level.cells[0] - 1 === x) {
              break;
            } else if (9 === mineArray[y - 1][x + 1]) {
              mineArray[y][x]++;
            }
            break;
          case 3:
            if (0 === x) {
              break;
            } else if (9 === mineArray[y][x - 1]) {
              mineArray[y][x]++;
            }
            break;
          case 4:
            if (_level.cells[0] - 1 === x) {
              break;
            } else if (9 === mineArray[y][x + 1]) {
              mineArray[y][x]++;
            }
            break;
          case 5:
            if (_level.cells[1] - 1 === y || 0 === x) {
              break;
            } else if (9 == mineArray[y + 1][x - 1]) {
              mineArray[y][x]++;
            }
            break;
          case 6:
            if (_level.cells[1] - 1 === y) {
              break;
            } else if (9 === mineArray[y + 1][x]) {
              mineArray[y][x]++;
            }
            break;
          case 7:
            if (_level.cells[1] - 1 == y || _level.cells[0] - 1 == x) {
              break;
            } else if (9 == mineArray[y + 1][x + 1]) {
              mineArray[y][x]++;
            }
            break;
        }
      }
    }
  }
}

/**
 * 翻开格子
 * @param {object} cell 
 * @param {object} ctx 
 * @param {string} skin 
 * @param {string} level 
 * @returns {boolean|string} false: 不需要操作，number: 数字，background：空白，lose：失败，win：胜利
 */
export const flip = (cell, ctx, skin, level) => {
  const _skin = skins.find(item => item.key === skin)
  const {
    x,
    y
  } = cell
  // 非 cover 状态
  if (showArray[y][x]) {
    return false;
  }
  // 下面是数字
  if ((1 <= mineArray[y][x]) && (8 >= mineArray[y][x])) {
    showArray[y][x] = 4;
    drawCell(cell, ctx, _skin)
    if (hasWin(level)) return 'win'
    return 'number'
  }
  //下面是空白
  if (0 == mineArray[y][x]) {
    spaceCell(cell, ctx, skin, level)
    if (hasWin(level)) return 'win'
    return 'background'
  }
  //下面是地雷
  if (9 == mineArray[y][x]) {
    boom(cell, ctx, skin, level)
    return 'lose'
  }
}

/**
 * 翻开空白，需要递归检查周围格子
 * @param {object} cell 
 * @param {object} ctx 
 * @param {string} skin 
 * @param {string} level 
 */
export const spaceCell = (cell, ctx, skin, level) => {
  const _skin = skins.find(item => item.key === skin)
  const _level = levels.find(item => item.key === level)
  showArray[cell.y][cell.x] = 5;
  drawCell(cell, ctx, _skin);

  for (var i = 0, x = null, y = null; i < 8; i++) {
    switch (i) {
      case 0:
        x = cell.x;
        y = cell.y - 1;
        if (-1 != y) {
          spaceOrNumber(x, y);
        }
        break;
      case 1:
        x = cell.x + 1;
        y = cell.y;
        if (_level.cells[0] != x) {
          spaceOrNumber(x, y);
        }
        break;
      case 2:
        x = cell.x;
        y = cell.y + 1;
        if (_level.cells[1] != y) {
          spaceOrNumber(x, y);
        }
        break;
      case 3:
        x = cell.x - 1;
        y = cell.y;
        if (-1 != x) {
          spaceOrNumber(x, y);
        }
        break;
      case 4:
        x = cell.x - 1;
        y = cell.y - 1;
        if (-1 != y && -1 != x) {
          spaceOrNumber(x, y);
        }
        break;
      case 5:
        x = cell.x + 1;
        y = cell.y - 1;
        if (_level.cells[0] != x && -1 != y) {
          spaceOrNumber(x, y);
        }
        break;
      case 6:
        x = cell.x + 1;
        y = cell.y + 1;
        if (_level.cells[0] != x && _level.cells[1] != y) {
          spaceOrNumber(x, y);
        }
        break;
      case 7:
        x = cell.x - 1;
        y = cell.y + 1;
        if (-1 != x && _level.cells[1] != y) {
          spaceOrNumber(x, y);
        }
        break;
    }
  }

  // 如果下面是空格或者数字，要递归调用 spaceCell 或者 flip
  function spaceOrNumber(x, y) {
    if (0 == showArray[y][x]) {
      if (0 == mineArray[y][x]) {
        spaceCell({
          x,
          y
        }, ctx, skin, level);
      } else if ((1 <= mineArray[y][x]) && (8 >= mineArray[y][x])) {
        flip({
          x,
          y
        }, ctx, skin, level);
      }
    }
  }
}

/**
 * 是否赢了
 * 如果 restMines 为 0，或者没有翻开和标记的格子数量等于此难度雷的数量，则为胜
 * @param {string} level 难度
 */
export const hasWin = (level) => {
  if (restMines === 0) return true
  const _level = levels.find(item => item.key === level)
  if (showArray.reduce((prev, cur) => prev + cur.reduce((subPrev, subCur) => subPrev + (subCur === 0 || subCur === 1 ? 1 : 0), 0), 0) === _level.mines) return true
  return false
}

/**
 * 显示所有地雷
 * @param {object} cell 
 * @param {object} ctx 
 * @param {string} skin 
 * @param {string} level 
 */
export const boom = (cell, ctx, skin, level) => {
  const {
    x,
    y
  } = cell
  const _skin = skins.find(item => item.key === skin)
  const _level = levels.find(item => item.key === level)
  showArray[y][x] = 3;
  drawCell(cell, ctx, _skin);

  for (let y = 0; y < _level.cells[1]; y++) {
    for (let x = 0; x < _level.cells[0]; x++) {
      if (9 == mineArray[y][x] && 3 !== showArray[y][x]) {
        showArray[y][x] = 2;
        drawCell({
          x,
          y
        }, ctx, _skin);
      }
    }
  }
}

/**
 * 右键标记
 * @param {object} cell 
 * @param {object} ctx 
 * @param {string} skin 
 * @param {string} level 
 * @returns {boolean|number|object} 
 */
export const rightClick = (cell, ctx, skin, level) => {
  const _skin = skins.find(item => item.key === skin)
  // cover 状态，可以标记
  if (0 == showArray[cell.y][cell.x]) {
    // 如果没有可标记数量，不操作
    if (restMinesShow === 0) return false
    // 否则标记
    showArray[cell.y][cell.x] = 1;
    drawCell(cell, ctx, _skin);
    restMinesShow--
    // 如果是雷，restMines 减一
    if (9 == mineArray[cell.y][cell.x]) {
      restMines--
      if (hasWin(level)) return {
        win: true,
        restMinesShow
      }
    }
    return {
      restMinesShow
    }
  } else if (1 == showArray[cell.y][cell.x]) { // 已经标记了，取消标记
    showArray[cell.y][cell.x] = 0;
    restMinesShow++
    // 如果是雷，restMines 加一
    if (9 === mineArray[cell.y][cell.x]) {
      restMines++
    }
    drawCell(cell, ctx, _skin);
    return {
      restMinesShow
    }
  } else {
    return false;
  }
}