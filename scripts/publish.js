const { publish } = require('gh-pages')

publish('.', {
  src: [
    '.nojekyll',
    'CNAME',
    'index.js',
    'bundle.js',
    'style.css',
    'index.html'
  ],
  dotfiles: true
}, console.log)
