const { default: slugify } = require('slugify')

const generateSlug = (name) => {
    return slugify(name, { lower: true, strict: true, locale: 'vi', trim: true }) + '-' + Date.now()
}

module.exports = { generateSlug }
