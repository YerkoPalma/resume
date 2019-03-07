const { publish } = require('gh-pages')

publish('.', {
  src: [
    '.nojekyll',
    'CNAME',
    'index.js',
    'bundle.js',
    'style.css',
    'index.html',
    'resume.md',
    'resume.en.md'
  ],
  dotfiles: true
}, console.log)
