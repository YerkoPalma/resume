/* global fetch */
import markdown from 'https://unpkg.com/md?module'
import { html, render } from 'https://unpkg.com/lit-html?module'

(async function () {
  let source = 'resume.md'
  let response
  let result
  let md
  // let page = document.querySelector('article')
  let langToggleButton = document.querySelector('#lang-toggle')
  langToggleButton.addEventListener('click', async (e) => {
    e.preventDefault()
    if (source === 'resume.md') {
      source = 'resume.en.md'
      langToggleButton.textContent = 'Versión en español'
    } else {
      source = 'resume.md'
      langToggleButton.textContent = 'English version'
    }

    // page.classList.remove('show')
    // page.classList.add('hide')
    // page.innerHTML = ''
    Array.prototype.map.call(document.querySelectorAll('article'), article => {
      article.remove()
    })
    const page = await init(source)
    paginate(page)
    // page.classList.remove('hide')
    // page.classList.add('show')
  })
  try {
    const page = await init(source)

    // paginate
    paginate(page)
  } catch (e) {
    console.log(e)
  }

  function removeChilds (parent, from, to) {
    let childrenToRemove = []
    let j = 0
    for (let i = from; i < to; i++) {
      childrenToRemove[j] = parent.children[i]
      j++
    }
    for (let i = 0; i < childrenToRemove.length; i++) childrenToRemove[i].remove()
  }

  async function init (source) {
    let page = document.createElement('article')
    page.classList.add('left-0')
    page.classList.add('right-0')
    page.classList.add('bg-white')
    page.classList.add('shadow-1')
    page.classList.add('dtr')
    page.classList.add('pv4')
    page.classList.add('ph6')
    page.classList.add('center')
    langToggleButton.after(page)
    response = await fetch(source)
    if (response && response.ok) {
      result = await response.text()
      md = markdown(result)
      render(html([md]), page)
      return page
    }
  }

  function paginate (page) {
    let pageSize = page.clientHeight
    let contentSize = Array.prototype.reduce.call(page.children, (prev, acc) => {
      return prev + acc.offsetHeight + parseInt(window.getComputedStyle(acc).marginBottom) + parseInt(window.getComputedStyle(acc).marginTop)
    }, 0)
    if (contentSize > pageSize) {
      let acumSize = 0
      let i = 0
      let numChilds = page.children.length
      for (let j = 0; j < numChilds; j++) {
        let child = page.children[i]
        let isPageBreak = child.tagName === 'HR'
        acumSize += isPageBreak ? child.offsetHeight + parseInt(window.getComputedStyle(child).marginBottom) + parseInt(window.getComputedStyle(child).marginTop) : 0
        if (acumSize > pageSize || isPageBreak) {
          if (isPageBreak) child.remove()
          let newPage = page.cloneNode(true)
          removeChilds(newPage, 0, i)
          removeChilds(page, i, page.children.length)
          page.after(newPage)
          page.style.visibility = 'visible'
          page = newPage
          acumSize = 0
          i = 0
        } else {
          i++
        }
      }
      page.style.visibility = 'visible'
    } else {
      page.style.visibility = 'visible'
    }
  }
})()
