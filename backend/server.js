const express = require('express');
const cors = require('cors');
require('dotenv').config();
const productosRoutes = require('./routes/productos');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', productosRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 