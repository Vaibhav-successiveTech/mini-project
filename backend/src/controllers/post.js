import Router from 'router';
import PostModel from '../models/Post.js';
import authiorizeMiddleware from '../middleware/tokenMiddleware.js';
import mongoose from 'mongoose';
import UserModel from '../models/User.js';
import multer from "multer";

// configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // make sure "uploads" folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });


const postRouter = Router();

postRouter.post('/posts/create', authiorizeMiddleware, async (req, res) => {
    const userId = req.user;
    const { text, avatar } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    try {
        const newPost = new PostModel({ user: new mongoose.Types.ObjectId(userId), text, avatar });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

postRouter.delete('/posts/:id', authiorizeMiddleware, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user;
    const resp = await PostModel.findById(postId);
    if (!resp) {
        return res.status(404).json({ error: "Post not found" });
    }
    if (resp.user.toString() !== userId) {
        return res.status(403).json({ error: "User not authorized to delete this post" });
    }
    try {
        const resp = await PostModel.findByIdAndDelete(postId);
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

postRouter.get('/posts', authiorizeMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const posts = await PostModel.find({ user: userId }).populate('user', 'name avatar');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

postRouter.put('/posts/:id', authiorizeMiddleware, upload.single("image"), async (req, res) => {
    try {
        const userId = req.user;
        const postId = req.params.id;
        const { text } = req.body;   // comes from form-data text field
        const resp = await PostModel.findById(postId).populate('user', 'name avatar');
        console.log(resp.user, userId);
        if (!resp) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (resp.user._id.toString() != userId) {
            return res.status(403).json({ error: "User not authorized to update this post" });
        }

        // update text
        if (text) resp.text = text;

        // update image if uploaded
        if (req.file) {
            const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
            resp.avatar = url;
        }
        console.log(resp);
        await resp.save();
        res.status(200).json(resp);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


postRouter.put('/posts/:id/like', authiorizeMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const postId = req.params.id;
        const resp = await PostModel.findById(postId);
        if (!resp) {
            return res.status(404).json({ error: "Post not found" });
        }
        const exist = resp.likes.filter(like => like.user?.toString() === userId);
        if (!exist.length) {
            resp.likes.push({ user: userId });
        } else {
            const newLikes = resp.likes.filter((like) => like.user?.toString() !== userId);
            resp.likes = newLikes;
        }
        await resp.save();
        res.status(200).json(resp.likes);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

postRouter.put('/posts/:id/comment', authiorizeMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const { text } = req.body;
        const postId = req.params.id;
        let resp = await PostModel.findById(postId);
        if (!resp) {
            return res.status(404).json({ error: "Post not found" });
        }
        resp.comments.push({ user: userId, text });
        await resp.save();
        res.status(200).json(resp.comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

postRouter.get('/posts/:id/comment', async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id).populate('comments.user', 'name avatar');
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post.comments);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

postRouter.get('/posts/all', async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user', 'name avatar');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default postRouter;