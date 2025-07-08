require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const clientRoutes = require('./routes/clientRoutes');
const estimateRoutes = require('./routes/estimateRoutes');
const subcategoryRoutes = require('./routes/subcategory');
const sectionRoutes = require('./routes/section');
const careerRoutes = require('./routes/careerRoutes');
const stageRoutes = require('./routes/stageRoutes');
const clientPaymentRoutes = require('./routes/clientPaymentRoutes');
const clientExpenseRoutes = require('./routes/clientExpenseRoutes');
const bankRoutes = require('./routes/bankRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://admin.takshaga.com', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json()); 
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://takshaga:Takshaga2025@takshagamanagement.yk8heda.mongodb.net/?retryWrites=true&w=majority&appName=takshagaManagement")
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error(" Database connection error:", err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/client-payments', clientPaymentRoutes);
app.use('/api/client-expenses', clientExpenseRoutes);
app.use('/api/banks', bankRoutes);

// Start server
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
// Express example
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.get('/wake', (req, res) => {
  res.send('Backend is awake');
});
