const svgtofont = require('svgtofont').default || require('svgtofont')
const path = require('path')

const srcDir = path.resolve(process.cwd(), 'src/assets/icons')
const distDir = path.resolve(process.cwd(), 'public/font')

svgtofont({
  src: srcDir,
  dist: distDir,
  fontName: 'icons',
  classNamePrefix: 'icon', // Output singular '.icon-' prefix mapping
  startUnicode: 0xE001, // Align with the legacy Private Use Area starting character (0xE001)
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true
  },
  css: {
    output: path.resolve(process.cwd(), 'src/styles'), // Output CSS to src/styles for bundler importing
    cssPath: '/font/', // Absolute-pathed from public directory for clean asset serving
    fileName: 'icons'
  }
})
.then(() => {
  console.log('✨ Icon font successfully compiled in public/font/!')
})
.catch((err) => {
  console.error('❌ Error building icon font:', err)
  process.exit(1)
})
