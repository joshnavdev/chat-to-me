const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: { type: String },
  email: { type: String },
  password: { type: String }
}, {
  versionKey: false
});

mongoose.model('user', UserSchema);
