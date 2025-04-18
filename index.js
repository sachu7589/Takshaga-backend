const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const materialRoutes = require('./routes/materialRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect("mongodb+srv://takshaga:Takshaga2025@takshagamanagement.yk8heda.mongodb.net/?retryWrites=true&w=majority&appName=takshagaManagement")
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error(" Database connection error:", err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/clients', clientRoutes);

// Start server
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
