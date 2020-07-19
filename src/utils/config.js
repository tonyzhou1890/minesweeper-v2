// 游戏难度
export const levels = [
  {
    key: 'rows9',
    text: '初级',
    cells: [9, 9],
    mines: 10
  },
  {
    key: 'rows12',
    text: '中级',
    cells: [12, 12],
    mines: 25
  },
  {
    key: 'rows15',
    text: '高级',
    cells: [15, 15],
    mines: 40
  }
]

// 皮肤
export const skins = [
  {
    key: 'default',
    text: '默认',
    background: "white",
    lineWidth: 2,
    lineColor: "black",
    numberColor: "blue",
    numberFontFamily: "Arial",
  },
  {
    key: 'handpainted',
    text: '手绘',
    background: "white",
    lineWidth: 2,
    lineColor: "white",
    numberColor: "blue",
    numberFontFamily: "Arial",
  }
]

// 皮肤路径
export const skinPath = './img/assets/skins/'

// 背景
export const backgrounds = [
  {
    key: 'default',
    text: '默认',
  },
  {
    key: 'brick',
    text: '砖块'
  },
  {
    key: 'draw',
    text: '手绘'
  }
]

// 背景路径
export const backgroundPath = './img/assets/backgrounds/'

// 方格宽度
export const cellWidth = 40

// 默认设置
export const defaultConfig = {
  level: 'rows9',
  skin: 'default',
  background: 'default'
}

// 存档名称
export const localSaveName = 'minesweeperSave'

// 设置名称
export const localSettingName = 'minesweeperSetting'
