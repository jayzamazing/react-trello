'use strict';
import mongoose from 'mongoose';
//used to delete the database
const deleteDb = () => {
  return mongoose.connection.db.dropDatabase();
}
