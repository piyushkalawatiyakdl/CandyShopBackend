const Express = require('express');
const sequelize = require('./database/database');
const Product=require('./models/product')

const cors = require('cors');

const app = Express();
app.use(cors());
app.use(Express.json());

app.post('/getData', async (req, res) => {
    try {
      const { candy, price, description, quantity } = req.body;
  
      // Create a new product using the Product model
      const newProduct = await Product.create({
        candy,
        price,
        description,
        quantity,
      });
  
      res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ success: false, error: 'Failed to save data' });
    }
  });


  app.get('/getData', async (req, res) => {
    try {
      // Retrieve all products from the database
      const products = await Product.findAll();
  
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch data' });
    }
  });

app.put('/getData/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Find the product by ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Candy not found' });
    }

    if( product.quantity<=0){
        return res.status(404).json({ success: false, error: 'Candy quantity not enough' });
    }
    else{
        product.quantity -= quantity;   // Update the quantity of the product
    }
    await product.save();  // Save the updated product to the database

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ success: false, error: 'Failed to update quantity' });
  }
});

app.delete('/getData/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Candy not found' });
    }

    await product.destroy(); // Delete the product from the database

    res.status(200).json({ success: true, message: 'Candy deleted successfully' });
  } catch (error) {
    console.error('Error deleting candy:', error);
    res.status(500).json({ success: false, error: 'Failed to delete candy' });
  }
});



Product
  .sync()
  .then(() => {
    console.log('Database synced');
    app.listen(3000, () => {
      console.log('Server running');
    });
  })
  .catch((err) => {
    console.log(err);
  });