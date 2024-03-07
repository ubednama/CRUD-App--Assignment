import Category from '../models/category.model.js';

export const create = (req, res) => {
  if (!req.body.Name) {
    res.status(400).send({ message: 'Category name cannot be empty!' });
    return;
  }

  const category = {
    name: req.body.Name,
  }

  const id = req.body.id;
  console.log("From create for id ",id);

  if(id && id != 0 && typeof parseInt(id) === 'number' ? true : false) {
    category.id = id
  }

  console.log(category)
  Category.create(category, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the category.',
      });
    } else {
      console.log("from create controller: ", data)
      res.send({ message: `Category ${data.name} with id ${data.id} created successfully `});
    }
  });
};


export const getAll = (req, res) => {
  let { page, limit, search } = req.query;
  if (parseInt(limit)) limit = parseInt(limit);
  else limit = 10;
  page = !isNaN(page) ? parseInt(page) : 1;

  // console.log("from getALL ", parseInt(page), page, limit);

  let searchFunction;
  if (search) {
      if (!isNaN(search)) {
        console.log("from get all in search for category", search)
        searchFunction = Category.findById;
      } else {
        search = `%${search}%`;
        searchFunction = Category.findByName;
      }
  } else {
      searchFunction = Category.getAll;
  }

  searchFunction(search, page, limit, (err, data) => {
      if (err) {
          res.status(500).send({
              message: err.message || 'Some error occurred while retrieving categories.',
          });
      } else {
        console.log("from backend ",req.query.search)
        res.render('index', { 
          items: data.items, 
          totalResults: data.totalResults, 
          tableName: "categories",  
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
  const id = req.params.categoryId;
  if (!req.body.newItemName || !id) {
      res.status(400).json({ message: 'Both Category ID and name are required to update Category' });
      return;
  }

  const updateCategory = {
      name: req.body.newItemName,
  };
  console.log("from update category controller: ", req.body.newItemName, updateCategory)

  Category.updateById(id, updateCategory, (err, data) => {
    if (!data || data.affectedRows === 0) {  
      res.status(404).send({ message: `Category with id ${id} not found` });}
    else if (err) {
              res.status(500).send({ message: `Error updating category: ${err}` });
    } else {
        res.send({ message: `Category ${data.oldName} with id ${id} updated to ${updateCategory.name} successfully `});
    }
  });
};

// Delete a category by id
export const deleteCategory = (req, res) => {
  Category.remove(req.params.categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Could not delete category with id ' + req.params.categoryId,
      });
    } else {
      if (!data || data.affectedRows === 0) {
        res.status(404).send({
          message: `Category with id ${req.params.categoryId} not found.`,
        });
      } else {
        res.send({ message: 'Category with id ' + req.params.categoryId + ' was deleted successfully!' });
      }
    }
  });
};