"use strict";

import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
	const { page } = req.query;
	try {
		const LIMIT = 8;
		const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every pages
		const total = await PostMessage.countDocuments({});

		const posts = await PostMessage.find()
			.sort({ _id: -1 }) // NEWSET TO THE OLDEST
			.limit(LIMIT)
			.skip(startIndex);

		res.status(200).json({
			data: posts,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / LIMIT),
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getPost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await PostMessage.findById(id);

		res.status(200).json(post);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// QUERY -> /posts?page=1 -> page = 1 : 검색을 통해 리소스를 찾을 때 사용
// PARAMS -> /posts/123 -> id = 123 : 리소스를 백엔드에서 받아올 때 사용
export const getPostsBySearch = async (req, res) => {
	const { searchQuery, tags } = req.query;
	try {
		// 'i' flag means 'ignore' ex) text Text TEXT -> 'text'로 검색
		const title = new RegExp(searchQuery, "i");

		const posts = await PostMessage.find({
			$or: [{ title }, { tags: { $in: tags.split(",") } }],
		});

		res.json({ data: posts });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createPost = async (req, res) => {
	const post = req.body;

	const newPost = new PostMessage({
		...post,
		creator: req.userId,
		createdAt: new Date().toISOString(),
	});
	try {
		await newPost.save();

		res.status(201).json(newPost);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const updatePost = async (req, res) => {
	const { id: _id } = req.params;
	const post = req.body;

	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send("No post with that id");

	const updatedPost = await PostMessage.findByIdAndUpdate(
		_id,
		{ ...post, _id },
		{
			new: true,
		}
	);

	res.json(updatedPost);
};

export const deletePost = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send("No post with that id");

	await PostMessage.findByIdAndRemove(id);

	res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
	const { id } = req.params;

	if (!req.userId) return res.json({ message: "Unauthenticated" });

	// 유저가 like 버튼의 게시글이 있는지 확인
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send("No post with that id");

	const post = await PostMessage.findById(id);

	// 유저가 해당 post에 like 버튼을 누른 적이 있는지 확인
	const index = post.likes.findIndex((id) => id === String(req.userId));

	if (index === -1) {
		// like the post
		post.likes.push(req.userId);
	} else {
		// dislike a post
		post.likes = post.likes.filter((id) => id !== String(req.userId));
	}

	const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
		new: true,
	});

	res.json(updatedPost);
};
