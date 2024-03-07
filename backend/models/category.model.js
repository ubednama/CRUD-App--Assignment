import sql from '../config/db.config.js';

class Category {
  constructor(category) {
    this.name = category.name;
  }

  static create(category, result) {
    if(category.id && category.name) {
      sql.query('INSERT INTO categories VALUES (?, ?)', [category.id, category.name], (err, res) => {
        if (err) {
          console.error('Error creating category with id and name:', err);
          result(err, null);
          return;
        }
        console.log('Created category:', { id: res.insertId, ...category });
        result(null, { id: res.insertId, ...category });
      })
    }
      else {
    sql.query('INSERT INTO categories (name) VALUES (?)', [category.name], (err, res) => {
      if (err) {
        console.error('Error creating category with name:',category.name, err);
        result(err, null);
        return;
      }
      console.log('Created category:', { id: res.insertId, ...category });
      result(null, { id: res.insertId, ...category });
    });
    }
  }

  static findById(categoryId, page, limit, result) {
    let query, params;
    if (page && limit) {
      console.log("here")
      const offset = (page - 1) * limit;
      query = `SELECT * FROM categories WHERE id = ? LIMIT ?, ?`;
      params = [parseInt(categoryId), offset, limit];
      console.log(params)
    } else {
      query = `SELECT * FROM categories WHERE id = ?`;
      params = [parseInt(categoryId)];
    }
    sql.query(query, params , (err, res) => {
      if (err) {
          console.error('Error finding category by id:', err);
          result(err, null);
          return;
      }

      if (res.length) {
        console.log('Found category:', res[0]);
        result(null, {items: res, totalResults: 1});
      } else {
        result(null, { message: 'Category not found', totalResults: 0, items: [] });
      }
    });
  }

  static findByName(categoryName, page, limit, result) {
    console.log("c name",categoryName)
    const offset = (page - 1) * limit;
    sql.query(`SELECT *, (SELECT COUNT(*) FROM categories WHERE name LIKE ?) AS count FROM categories WHERE name LIKE ? LIMIT ?, ?`, [categoryName, categoryName, offset, limit], (err, res) => {
        if (err) {
            console.error('Error finding category by Name:', err);
            result(err, null);
            return;
        }

      if (res.length) {
          console.log('Found categories:', res, " totalResults:", res[0].count);
          result(null, { items: res, totalResults: res[0].count});
      } else {
        if (offset > 0) {
          const previousPage = Math.max(page - 1, 1);
          Category.findByName(categoryName, previousPage, limit, result);
        } else {
            result(null, { items: [], totalResults: 0, message: 'Category not found' });
        }
      }
    });
  }

  static getAll(search, page, limit, result) {
    const offset = (page - 1) * limit;

    sql.query('SELECT COUNT(*) AS total FROM categories', (err, resCount) => {
      if (err) {
        console.error('Error fetching total results:', err);
        result(err, null);
        return;
      }
  
      const totalResults = resCount[0].total;
  
      sql.query(`
        SELECT c.id, c.name, IFNULL(p.productCount, 0) AS productCount
        FROM categories c
        LEFT JOIN (
            SELECT CategoryId, COUNT(*) AS productCount
            FROM products
            GROUP BY CategoryId
        ) p ON c.id = p.CategoryId
        LIMIT ?, ?
      `, [offset, limit], (err, res) => {
        if (err) {
          console.error('Error fetching categories with product counts:', err);
          result(err, null);
          return;
        }
        console.log('Fetched categories:', res, " totalResults:", totalResults);
        result(null, { items: res, totalResults: totalResults, limit: limit });
      });
    });
  }

  static updateById(id, category, result) {
    Category.findById(id, 1, 10000, (err, data)=>{
      if(err){
        console.log("Error finding category while updating category:",err)
        return;
      }
      if(!data) {
        console.log(`Category with ID ${id} not found.`);
        return;
      }
      console.log("data from findById in updateById",data)
      const categoryOldName = data.items[0].name;
      console.log("Updating Category ",categoryOldName);
      sql.query(
        'UPDATE categories SET name = ? WHERE id = ?',
        [category.name, id],
        (err, res) => {
          if (err) {
            console.error('Error updating category:', err);
            result(err, null);
            return;
          }

          if (res.affectedRows === 0) {
            result({ message: 'Category not found' }, null);
            return;
          }

          console.log(`Updated ${categoryOldName} to:`, { id: id, ...category });
          result(null, {oldName: categoryOldName, id: id, ...category });
        }
      );
  })
  }

  static remove(id, result) {
    sql.query('DELETE FROM categories WHERE id = ?', id, (err, res) => {
      if (err) {
        console.error('Error deleting category:', err);
        result(err, null);
        return;
      }

      if (res && res.affectedRows === 0) {
        result({ message: 'Category not found' }, null);
        return;
      }

      console.log('Deleted category with id:', id);
      result(null, res);
    });
  }
}

export default Category;