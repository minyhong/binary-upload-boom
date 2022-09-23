const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postID: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Post",
  },
  comment: {
   type: String,
   required: true,
},
  likes: {
    type: Number,
    required: true,
  },
  commentByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
