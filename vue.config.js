const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  pwa: {
    name: '扫雷',
    themeColor: '#648CBA',
    msTileColor: '#E0CCCC',
    manifestOptions: {
      background_color: '#E0CCCC'
    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      title: 'minesweeper(扫雷)'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}