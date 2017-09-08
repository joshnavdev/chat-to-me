const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LoginSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  loged_date: { type: Date, default: Date.now }
});

mongoose.model('login', LoginSchema);
