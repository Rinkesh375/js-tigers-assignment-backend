const express = require('express');
const {userRouter} = require("./server/routes/user.Routes")
const vendorRoutes = require('./server/routes/vendorRoutes');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();

require('dotenv').config()

const PORT = 5000;


app.use(express.json());
app.use(cors());






// Routes
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Home page' });
});

// app.use('/auth', authRoutes);
app.use('/vendors', vendorRoutes);
app.use("/user", userRouter);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
   
    console.log(`Server is running at ${PORT}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
