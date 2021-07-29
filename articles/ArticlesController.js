const express = require('express')
const slugify = require('slugify')
const Category = require('../categories/Category')
const Article = require('./Article')
const adminAuth = require('../middlewares/adminAuth')

const router = express.Router()

// usamos por padrão no findAll.then() como variavel o mesmo nome da tabela do banco de dados
router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then(articles => {
    res.render('admin/articles/index', { articles: articles })
  })
})

// usamos por padrão no findAll.then() como variavel o mesmo nome da tabela do banco de dados
router.get('/admin/articles/new', adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/articles/new', { categories: categories })
  })
})

// name no body: nome da coluna
router.post('/articles/save', adminAuth, (req, res) => {
  const title = req.body.title
  const category = req.body.category
  const body = req.body.body

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category
  }).then(() => {
    res.redirect('/admin/articles')
  })
})

router.post('/articles/delete',adminAuth , (req, res) => {
  const id = req.body.id

  if (id !== undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect('/admin/articles')
      })
    } else { // Não for numero
      res.redirect('/admin/articles')
    }
  } else { // Se for NUll
    res.redirect('/admin/articles')
  }
})

router.get('/category/:slug', (req, res) => {
  const slug = req.params.slug
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  }).then(category => {
    if (category !== undefined) {
      Category.findAll().then(categories => {
        res.render('index',
          {
            articles: category.articles,
            categories: categories
          })
      })
    } else {
      res.redirect('/')
    }
  }).catch(err => {
    res.redirect('/')
  })
})

router.get('/admin/articles/edit/:id', adminAuth,  (req, res) => {
  const id = req.params.id

  Article.findByPk(id).then(article => {
    if (article !== undefined) {
      Category.findAll().then(categories => {
        res.render('admin/articles/edit', { categories: categories, article: article })
      })
    } else {
      res.redirect('/')
    }
  }).catch(err => {
    res.redirect('/')
  })
})

router.post('/articles/update', adminAuth,  (req, res) => {
  const id = req.body.id
  const title = req.body.title
  const body = req.body.body
  const category = req.body.category

  Article.update({ title: title, slug: slugify(title), body: body, categoryId: category }, {
    where: {
      id: id
    }
  }).then(() => {
    res.redirect('/admin/articles')
  }).catch(err => {
    res.redirect('/')
  })
})

router.get('/articles/page/:num', (req, res) => {
  const page = req.params.num
  let offset = 0

  if (isNaN(page) || page === 1) {
    offset = 0
  } else {
    offset = (parseInt(page) - 1) * 4
  }

  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [
      ['id', 'DESC']
    ]
  }).then(articles => {
    let next
    if ((offset + 4) >= articles.count) {
      next = false
    } else {
      next = true
    }

    const result = {
      page: parseInt(page),
      next: next,
      articles: articles
    }

    Category.findAll().then(categories => {
      res.render('admin/articles/page', {
        result: result,
        categories: categories
      })
    })
  })
})

module.exports = router
