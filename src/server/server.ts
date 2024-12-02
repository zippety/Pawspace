import { app, connectDB } from './app';

const PORT = process.env.PORT || 3001;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
