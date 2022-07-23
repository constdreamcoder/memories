import {
	FETCH_ALL,
	CREATE,
	UPDATE,
	DELETE,
	LIKE,
	FETCH_BY_SEARCH,
	START_LOADING,
	ENd_LAODING,
	FETCH_POST,
	COMMENT,
} from "../constants/actionTypes";

export default (state = { isLoading: true, posts: [] }, action) => {
	switch (action.type) {
		case START_LOADING:
			return { ...state, isLoading: true };
		case ENd_LAODING:
			return { ...state, isLoading: false };
		case FETCH_ALL:
			return {
				...state,
				posts: action.payload.data,
				currentPage: action.payload.currentPage,
				numberOfPages: action.payload.numberOfPages,
			};
		case FETCH_BY_SEARCH:
			return { ...state, posts: action.payload };
		case FETCH_POST:
			return { ...state, post: action.payload };
		case DELETE:
			return {
				...state,
				posts: state.posts.filter((post) => post._id !== action.payload),
			};
		case LIKE:
		case UPDATE:
			return {
				...state,
				posts: state.posts.map((post) =>
					post._id === action.payload._id ? action.payload : post
				),
			};
		case COMMENT:
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id === action.payload._id) {
						// change the post that just received a comment...
						return action.payload;
					}
					// return all the other posts normally
					return post;
				}),
			};
		case CREATE:
			return { ...state, posts: [...state.posts, action.payload] };
		default:
			return state;
	}
};
