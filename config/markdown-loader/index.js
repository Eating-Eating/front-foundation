

const markdown = require('markdown-it')({
  preset: 'default',
  html: true,
  wrapper: 'section',
});
module.exports = function(source) {
  let output = markdown.render(source)
  return `export default ()=><div>${output}</div>`
}