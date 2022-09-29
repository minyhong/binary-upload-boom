const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      console.log(typeof posts[0].image === 'object')
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  submitPost: (req, res) => {
    res.render("submit.ejs");
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({postID: req.params.id}).sort({ createdAt: "desc" }).populate('commentByUserID').lean();
      const commentID = await Comment.find({postID: req.params.id}).sort({ createdAt: "desc" }).lean();
      console.log();
      res.render("post.ejs", { post: post, user: req.user, comments: comments, commentID: commentID});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);
      
      const imageUrlList = [];
      const cloudinaryID = [];

      for (let i = 0; i < req.files.length; i++) {
        let localFilePath = req.files[i].path;
        let result = await cloudinary.uploader.upload(localFilePath);
        imageUrlList.push(result.secure_url);
        cloudinaryID.push(result.public_id);
      }

      await Post.create({
        title: req.body.title,
        image: imageUrlList,
        cloudinaryId: cloudinaryID,
        caption: req.body.caption,
        location: req.body.location,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      let comments = await Comment.find({ postID: req.params.id })
      // Delete image from cloudinary
      // How to delete if multiple images
      if (typeof post.cloudinaryId === 'object') {
        for (let i = 0; i < post.cloudinaryId.length; i++) {
          await cloudinary.uploader.destroy.cloudinaryId;
        }
        // how to delete if single image
      } else {
        await cloudinary.uploader.destroy(post.cloudinaryId);
      }
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      // Delete the comments that were in the deleted post
      await Comment.remove({ postID: req.params.id });
      console.log(post, comments)
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      console.log(err)
      res.redirect("/profile");
    }
  },
};
