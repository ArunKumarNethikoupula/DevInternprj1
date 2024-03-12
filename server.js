const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload());

// Connect to MongoDB (replace 'your_database_url' with your MongoDB connection string)
mongoose.connect('your_database_url', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const { image } = req.files;
  const imagePath = `public/uploads/${image.name}`;

  try {
    // Save the image to the server (you may want to add more validation and error handling here)
    image.mv(imagePath);

    // Respond with the image path
    res.status(200).json({ imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
