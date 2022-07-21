"use strict";

import jwt from "jsonwebtoken";

// middleware
// wants to like a post
// click the like button => auth middleware (next) => like controller...

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		// token 길이가 500자 이상이면 google auth이고
		// 500자 미만이면 직접 가입한 유저이다.
		const isCustomAuth = token.length < 500;

		let decodedData;

		if (token && isCustomAuth) {
			// 소셜로그인( ex: 구글 로그인 등)을 하지 않은 유저의 정보 decoding
			decodedData = jwt.verify(token, "test");

			req.userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);

			// sub는 각 유저들을 구별해주는 일종의 id 이다.
			req.userId = decodedData?.sub;
		}

		next();
	} catch (error) {
		console.log(error);
	}
};

export default auth;
