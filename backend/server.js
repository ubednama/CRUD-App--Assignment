import express from 'express';
import path from 'path';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/frontend/public')));


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname,'/frontend', 'views'));

app.get('/cccc', (req, res) => {
  res.render('categoriesCopy')
});


// Routes
app.use('/', categoryRoutes);
app.use('/', productRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});