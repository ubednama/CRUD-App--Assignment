import Product from '../models/product.model.js';

export const create = (req, res) => {
  let categoryId = req.body.categoryId;
  if (!req.body.Name || (!isNaN(parseInt(categoryId)) && categoryId === 0)) {
    res.status(400).send({ message: 'Product name and category ID are required!' });
    return;
  }

  const product = new Product({
    productName: req.body.Name,
    categoryId: categoryId,
  });
  let id = req.body.id;
  console.log("b1 ",id)
  if(id && id != 0 && typeof parseInt(id) === 'number' ? true : false) {product.id = id}
  console.log("from backend product create controller ",product)
  Product.create(product, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the product.',
      });
    } else {
      res.send({ message: `Product ${data.name} with id ${data.id} & Category id ${categoryId} created successfully `});
    }
  });
};


export const findAll = (req, res) => {
  let { page, limit, search } = req.query;
  if (parseInt(limit)) limit = parseInt(limit);
  else limit = 10;
  page = !isNaN(page) ? parseInt(page) : 1;

  // console.log("from getALL ", page, limit);

  let searchFunction;
  if (search) {
      if (!isNaN(search)) {
        console.log("from get all in search", search)
        searchFunction = Product.findById;
      } else {
        search = `%${search}%`;
        searchFunction = Product.findByName;
      }
  } else {
      searchFunction = Product.getAll;
  }

  searchFunction(search, page, limit, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving products.',
      });
    } else {
      res.render('index', { items: data.items, totalResults: data.totalResults, tableName: "products",
      currentPage: Math.min(page, Math.ceil(data.totalResults/limit)), 
      limit: data.limit, 
      totalPages: Math.ceil(data.totalResults/limit), 
      start: Math.min(limit * (page - 1) + 1, data.totalResults),
      message: data.message,
      search: req.query.search,
      queryLimit: req.query.limit
      });
    }
  });
};

export const getAllByCategoryId = (req, res) => {
  let categoryId = req.params.categoryId;
  let { page, limit, search } = req.query;
  if (parseInt(limit)) limit = parseInt(limit);
  else limit = 10;
  page = page ? parseInt(page) : 1;
  console.log("from findallByCategoryId products: ",categoryId)
  Product.getAllByCategoryId(categoryId,page, limit, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving products.',
      });
    } else {
      res.render('index', { items: data.items, totalResults: data.totalResults, tableName: "Products",
      currentPage: Math.min(page, Math.ceil(data.totalResults/limit)), 
      limit: data.limit, 
      totalPages: Math.ceil(data.totalResults/limit), 
      start: Math.min(limit * (page - 1) + 1, data.totalResults),
      message: data.message,
      search: req.query.search,
      queryLimit: req.query.limit
      });
    }
  });
};

export const update = (req, res) => {
  if (!req.body.newItemName) {
    res.status(400).send({ message: 'Product name is required!' });
    return;
  }

  const product = new Product({
    productName: req.body.newItemName,
  });
  console.log("update from backend controller ",product)

  Product.updateById(req.params.productId, product, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Product with id ${req.params.productId} not found.`,
        });
      } else {
        res.status(500).send({
          message: 'Error updating product with id ' + req.params.productId,
        });
      }
    } else {
      res.send({ message: `Product ${data.oldName} with Id ${data.id} updated to ${product.productName} successfully `});
    }
  });
};

export const deleteProduct = (req, res) => {
  Product.remove(req.params.productId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Could not delete category with id ' + req.params.categoryId,
      });
    } else {
      if (!data || data.affectedRows === 0) {
        res.status(404).send({
          message: `Product with id ${req.params.productId} not found.`,
        });
      } else {
        res.send({ message: 'Product with id ' + req.params.productId + ' was deleted successfully!' });
      }
    }
  })
};