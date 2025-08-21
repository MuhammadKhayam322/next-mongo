const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import your models
const User = require("./src/models/User");
const Product = require("./src/models/Product");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://muhammadkhayam804:king1122@cluster0.bqh71q9.mongodb.net/productDB?retryWrites=true&w=majority&appName=Cluster0"
);

async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 12);
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
    });

    // Create sample products
    const products = await Product.insertMany([
      {
        name: "Wireless Bluetooth Headphones",
        description:
          "High-quality wireless headphones with noise cancellation and 20-hour battery life.",
        price: 89.99,
        category: "Electronics",
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      },
      {
        name: "Smart Fitness Watch",
        description:
          "Track your heart rate, steps, sleep, and more with this advanced fitness watch.",
        price: 149.99,
        category: "Electronics",
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=799&q=80",
      },
      {
        name: "Organic Cotton T-Shirt",
        description:
          "Comfortable and sustainable t-shirt made from 100% organic cotton.",
        price: 24.99,
        category: "Clothing",
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
      },
      {
        name: "Stainless Steel Water Bottle",
        description:
          "Keep your drinks hot or cold for hours with this insulated water bottle.",
        price: 34.99,
        category: "Accessories",
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },
      {
        name: "Leather Laptop Bag",
        description:
          "Professional laptop bag with multiple compartments and durable leather construction.",
        price: 129.99,
        category: "Accessories",
        inStock: false,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },
      {
        name: "Ceramic Coffee Mug Set",
        description:
          "Set of 4 beautifully crafted ceramic mugs perfect for your morning coffee.",
        price: 39.99,
        category: "Home & Kitchen",
        inStock: true,
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=402&q=80",
      },
    ]);

    console.log("Database seeded successfully!");
    console.log(`Created user: ${user.email}`);
    console.log(`Created ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
