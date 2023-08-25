const express = require("express");
const app = express();
const mongoose = require("mongoose");
const env = require('dotenv');
const cors = require('cors');
const path = require('path')


const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');


env.config();

mongoose.connect(
  `mongodb+srv://root:l2Ry2ONt0ftY3Ptp@cluster0.viqtkak.mongodb.net/?retryWrites=true&w=majority`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);
mongoose.connection.on('error', () => {
  console.log('error');
});
mongoose.connection.on('open', () => {
  console.log('connected to MongoDB...!');
});

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);


app.listen(2000, () => {
 console.log("Server is running ...!");
});