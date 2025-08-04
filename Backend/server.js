const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');


// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const aiMetaRoutes = require('./routes/aiMetaRoutes');

const commentRoutes = require('./routes/commentRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const userRequestRoutes = require('./requestUsers/userRequestRoutes');

const requestUserAccessRoutes = require('./requestUsers/requestUserAccess/requestUserAccessRoutes');


const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}

// Enable CORS
app.use(cors(corsOptions));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use("/api/v1/ai", aiMetaRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/sessions", sessionRoutes);


app.use("/api/v1/requests", userRequestRoutes);


app.use("/api/v1/user", requestUserAccessRoutes);





const PORT = 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});