import { withFilter } from 'graphql-subscriptions';
import MessageModel from '../models/message.js';
import UserModel from '../models/User.js';
import mongoose, { get } from 'mongoose';
import PostModel from '../models/Post.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { subscribe } from 'diagnostics_channel';
import { map } from 'zod';

const resolvers = {
    Query: {
        getMessages: async (_, { sender, receiver }) => {
            const senderId = new mongoose.Types.ObjectId(sender);
            const receiverId = new mongoose.Types.ObjectId(receiver);
            const res = await MessageModel.find({ sender: senderId, receiver: receiverId }).populate('sender').populate('receiver');
            const res2 = await MessageModel.find({ sender: receiverId, receiver: senderId }).populate('sender').populate('receiver');
            return [...res, ...res2];
        },
        getPosts: async () => {
            const res = await PostModel.find().populate('user', 'name avatar').populate('comments.user', 'name avatar').populate('likes.user', 'name');

            return res;
        },
        getLikes: async (_, { postId }) => {
            try {
                const likes = await PostModel.findById(postId).populate('likes.user', 'name');
                return likes.likes.map((i) => i.user);
            } catch (error) {
                console.log(error.message)
            }
        }
    },

    Mutation: {
        sendMessage: async (_, { sender, receiver, text }, { pubsub }) => {
            const message = new MessageModel({ sender, receiver, text });
            const saved = await message.save();

            const populated = await MessageModel.findById(saved._id)
                .populate('sender')
                .populate('receiver');

            pubsub.publish('MESSAGE_SENT', {
                messageSent: populated
            });

            return populated;
        },

        sendPost: async (_, { userId, text, avatar }, { pubsub }) => {
            const post = new PostModel({ user: userId, text, avatar }); // avatar = URL
            const saved = await post.save();
            const populated = await saved.populate('user', '_id name avatar');

            pubsub.publish('POST', { post: populated });
            return populated;
        },
        likePost: async (_, { postId, userId }, { pubsub }) => {
            try {
                const post = await PostModel.findById(postId);
                if (!post) throw new Error("Post not found");

                // Check if user already liked
                const alreadyLiked = post.likes.some(
                    (like) => like.user?.toString() === userId
                );

                if (alreadyLiked) {
                    // Remove like
                    post.likes = post.likes.filter(
                        (like) => like.user?.toString() !== userId
                    );
                } else {
                    // Add like
                    post.likes.push({ user: userId });
                }

                await post.save();

                // Re-fetch with populated user data
                const likeList = await PostModel.findById(postId).populate(
                    "likes.user",
                    "name"
                );

                const payload = {
                    likes: {
                        postId: postId,
                        likes: likeList.likes.map((i) => ({
                            id: i.user._id.toString(),
                            name: i.user.name,
                        })),
                    },
                };

                // Publish only for this postId
                pubsub.publish("LIKES", payload);

                return payload.likes.likes; // returns array of users who liked
            } catch (error) {
                console.error("Error in likePost:", error.message);
            }
        }

    },

    Subscription: {
        messageSent: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterableIterator(['MESSAGE_SENT'])
        },
        post: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterableIterator(['POST'])
        },
        likes: {
            subscribe: withFilter(
                (_,__,{pubsub}) => pubsub.asyncIterableIterator("LIKES"),
                (payload, variables) => {
                    // Only return if postId matches
                    return payload.likes.postId === variables.postId;
                }
            ),
        },
    }
};

export default resolvers;