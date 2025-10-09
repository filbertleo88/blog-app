import Post from '../models/postModel.js';

const createComment = async (req, res) => {
  const { text } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = {
      text,
      user: req.user._id,
      name: req.user.name,
    };

    post.comments.push(comment);

    await post.save();
    res.status(201).json({ message: 'Comment added' });
  } else {
    res.status(404).send('Post not found');
  }
};

export { createComment };
