const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        postID: req.params.id,
        commentByUserID: req.user.id,
      });
      console.log("Comment has been added!");
      res.redirect("/post/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    try {
      await Comment.findByIdAndUpdate(
        { _id: req.params.commentId },
        {
          $inc: { likes: 1 },
        }
      );
      const commentDoc = await Comment.findById(req.params.commentId)
      console.log("Likes +1");
      console.log(req)
      res.redirect(`/post/${commentDoc.postID}`)
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const commentDoc = await Comment.findById(req.params.commentId)
      await Comment.remove({_id: req.params.commentId})
      console.log("Deleted Comment");
      res.redirect(`/post/${commentDoc.postID}`)
    } catch (err) {
      console.log(err);
    }
  }
  
};
