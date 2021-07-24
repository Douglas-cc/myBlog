const express = require('express');
const connection = require('./database/database');

const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/Users');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

const app = express();

// Views engine
app.set('view engine', 'ejs');

// static
app.use(express.static('public'));

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// conexão com a database
connection.authenticate().then(() => {
  console.log("Conexão feita com Sucesso");
}).catch((error) => {
  console.log(error);
});

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


// rota
app.get("/", (req, res) => {
  Article.findAll({
    order:[
      ['id', 'DESC']
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render("index", { articles: articles, categories: categories });
    });
  });
});

app.get("/:slug", (req,res) => {
  var slug = req.params.slug;
  Article.findOne({
    where:{ slug: slug }
  }).then(article => {
    if(article != undefined){
      Category.findAll().then(categories => {
        res.render("article", { article: article, categories: categories });
      });
    }else{
      res.redirect("/");
    }
  }).catch( err => {
    res.redirect("/");
  });
});

// Porta
app.listen(4000, () => {
  console.log("O servidor está Ativo")
});