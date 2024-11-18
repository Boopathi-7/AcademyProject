// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
const uri = process.env.MONGO_URI;

mongoose.connect(uri,) .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the application if MongoDB connection fails
  });
  
  // Define schema and model
const academicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    mail: { type: String, required: true },
    password: { type: String, required: true },
  });
  
  const Academy = mongoose.model("Academy", academicSchema);
  
  // Routes
  
  // Create a new post
  app.post("/api/signup", async (req, res) => {
    try {
      const newAcademy = new Academy({
        name: req.body.name,
        number: req.body.number,
        mail: req.body.mail,
        password: req.body.password
      });
      const savedAcademy = await newAcademy.save();
      res.status(200).json(savedAcademy);
    } catch (error) {
      res.status(500).json({ error: error.message});
}
});

// Get all posts
app.get("/api/signup", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const academy = limit ? await Academy.find().limit(limit) : await Academy.find();
    res.status(200).json(academy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get post by ID
app.get("/api/signup/:id", async (req, res) => {
  try {
    const academy = await Academy.findById(req.params.id);
    if (academy) {
      res.status(200).json(academy);
    } else {
      res.status(404).json({ error: "Academy not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post by ID
app.put("/api/signup/:id", async (req, res) => {
  try {
    const academy = await Academy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensure the updated data is validated
    });
    if (academy) {
      res.status(200).json(academy);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post by ID
app.delete("/api/signup/:id", async (req, res) => {
  try {
    const academy = await Academy.findByIdAndDelete(req.params.id);
    if (academy) {
      res.status(200).json({ message: "academy deleted successfully" });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});