import sql from '../config/db.config.js';

class Product {
  constructor(product) {
    this.productName = product.productName;
    this.categoryId = product.categoryId;
  }

  static create(newProduct, result) {
    if(newProduct.categoryId && newProduct.productName && newProduct.id) {
      sql.query('INSERT INTO products VALUES (?, ?, ?)', [newProduct.id , newProduct.productName, newProduct.categoryId], (err, res) => {
        if (err) {
          console.error('Error creating product:', err);
          result(err, null);
          return;
        }

        console.log('Created product:', { id: res.insertId, ...newProduct });
        result(null, { id: res.insertId, ...newProduct });
      });
    } else {
      sql.query('INSERT INTO products (name, categoryId) VALUES (?,?)',[newProduct.productName, newProduct.categoryId], (err, res) => {
        if(err) {
          console.error(`Error creating new Product with name ${newProduct.productName} & Category ID ${newProduct.categoryId}`);
          result(err, null);
        } else {
          console.log("Created Product: ", {id: res.insertId, ...newProduct })
          result(null, { categoryId: newProduct.categoryId, id: res.insertId, ...newProduct });
        }
      })
    }
  }

  static findById(Id, page, limit, result) {
    console.log("here backendd")
    sql.query('SELECT p.id, p.name, p.categoryId, c.name AS categoryName  FROM products p JOIN categories c ON p.categoryId = c.id WHERE p.id = ?', [Id], (err, res) => {
      if (err) {
        console.error('Error finding product by id:', err);
        result({message: err}, null);
        return;
      }

      if (res.length) {
        console.log('Found product:', res[0]);
        result(null, {items: res, totalResults: 1 });
        return;
      } else {
        result(null,{ message: 'Product not found', totalResults: 0, items: [] });
      }
    });
  }

  static findByName(name, page, limit, result){
    const offset = (page - 1) * limit;
    sql.query ('SELECT p.id, p.name, p.categoryId, c.name AS categoryName, (SELECT COUNT(*) FROM products WHERE name LIKE ?) AS count FROM products p INNER JOIN categories c ON p.categoryId = c.id WHERE p.name LIKE ? LIMIT ?, ?',[name, name, offset, limit],
    (err, res) => {
      if (err) {
        console.error('Error finding Product by name: ', err);
        result(err, null);
        return;
      }

      if(res.length) {
        console.log("Found products: ", res, "total results: ", res[0].count);
        result(null, {items: res, totalResults: res[0].count});
      } else {
        if (offset > 0) {
          const previousPage = Math.max(page-1,1);
          Product.findByName(name, previousPage, limit, result);
        } else {
          result(null, {items: [], totalResults: 0, message: "Product not found"})
        }
      }
    });
  }

  static getAllByCategoryId(categoryId, page, limit, result) {
    const offset = (page - 1) * limit;

    sql.query('SELECT COUNT(*) AS total FROM products WHERE categoryId = ?',[categoryId], (err, resCount) => {
      if (err) {
        console.error('Error fetching total results:', err);
        result(err, null);
        return;
      }

    const totalResults = resCount[0].total
      sql.query('SELECT p.id, p.name, p.categoryId, c.name AS categoryName FROM products p INNER JOIN categories c ON p.categoryId = c.id WHERE categoryId = ? LIMIT ?, ?', [categoryId, offset, limit], (err, res) => {
      if (err) {
        console.error(`Error fetching all products in Category ${categoryId}:`, err);
        result(err, null);
        return;
      }

      console.log('Fetched all products: ', res, " totalResults:", res.length);
          result(null, { items: res, totalResults: totalResults, limit: limit });
      });
    })
  }


  static getAll(search, page, limit, result) {
    const offset = (page - 1) * limit;

    sql.query('SELECT COUNT(*) AS total FROM products', (err, resCount) => {
      if (err) {
        console.error('Error fetching total results:', err);
        result(err, null);
        return;
      }

    const totalResults = resCount[0].total
    
    sql.query('SELECT p.id, p.name, p.categoryId, c.name AS categoryName FROM products p INNER JOIN categories c ON p.categoryId = c.id LIMIT ?, ?', [offset, limit], (err, res) => {
    if (err) {
      console.error(`Error fetching all Products from database`, err);
      result(err, null);
      return;
    }

    console.log('Fetched all products: ', res, " totalResults:", res.length);
        result(null, { items: res, totalResults: totalResults, limit: limit });
    })
  });
}


  static updateById(id, product, result) {
    Product.findById(id, 1, 10000, (err, data) => {
      if(err){
        console.log("Error finding product while updating product:",err)
        return;
      }
      if(!data) {
        console.log(`Product with ID ${id} not found.`);
        return;
      }
      console.log("data from findById in updateById",data)
      const oldName = data.items[0].name;
      console.log("Updating Product ",oldName);
    sql.query(
      'UPDATE products SET name = ? WHERE id = ?',
      [product.productName, id],
      (err, res) => {
        if (err) {
          console.log("update from backend",productd)
          console.error('Error updating product:', err);
          result(err, null);
          return;
        }
        
        if (res.affectedRows === 0) {
          result({ message: 'Category not found' }, null);
          return;
        }
        
        console.log(`Updated ${oldName} to:`, { id: id, ...product });
        result(null, {oldName: oldName, id: id, ...product });
      }
      );
    })
  }

  static remove(id, result) {
    sql.query('DELETE FROM products WHERE id = ?', id, (err, res) => {
      if (err) {
        console.error('Error deleting product:', err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Deleted product with id:', id);
      result(null, res);
    });
  }
}

export default Product;