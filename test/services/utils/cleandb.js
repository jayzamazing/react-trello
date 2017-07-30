'use strict';
import mongoose from 'mongoose';
//used to delete the database
export const deleteDb = () => {
  return mongoose.connection.db.dropDatabase();
}
