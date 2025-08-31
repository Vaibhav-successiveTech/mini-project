import Router from 'router';
import authiorizeMiddleware from '../middleware/tokenMiddleware.js';
import ProfileModel from '../models/Profile.js';
import UserModel from '../models/User.js';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const profileRouter = Router();
const buildUpdateObject = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== "")
    );
};

profileRouter.put('/profile/update', authiorizeMiddleware, async (req, res) => {
    try {
        const userId = req.user
        const { location, status, skills, bio, experience, education, social, avatar,name,email } = req.body;
        const resp = await ProfileModel.findOne({ user: userId });
        if (!resp) {
            return res.status(404).json({ error: "Profile not found" });
        }
        const profileFields = buildUpdateObject({
            location,
            status,
            skills,
            bio,
            experience,
            education,
            social,
            avatar,
            name,
            email,
        });

        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { user: userId },
            { $set: profileFields },
            { new: true }
        );

        const userFields = buildUpdateObject({
            name: updatedProfile?.name,
            email: updatedProfile?.email,
            avatar: updatedProfile?.avatar,
        });

        const updateUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        );
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

profileRouter.get('/profile/me', authiorizeMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const resp = await ProfileModel.findOne({ user: userId }).populate('user', ['name', 'email']);
        if (!resp) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

profileRouter.delete('/profile/delete', authiorizeMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const resp = await ProfileModel.findOne({ user: userId });
        if (!resp) {
            return res.status(404).json({ error: "Profile not found" });
        }
        await ProfileModel.findOneAndDelete({ user: userId });
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});



profileRouter.get('/profile/:id', async (req, res) => {
    try {
        const profile = await ProfileModel.findOne({ user: req.params.id }).populate('user', 'name avatar');
        res.status(200).json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });

    }
});

export default profileRouter;