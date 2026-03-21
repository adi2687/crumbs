import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const setupDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crumbs_auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully!');
    console.log('Database: crumbs_auth');
    console.log('Collections will be created automatically when users register.');
    
    // Create indexes for better performance
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ deviceId: 1 }, { unique: true });
    
    console.log('Database indexes created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();
