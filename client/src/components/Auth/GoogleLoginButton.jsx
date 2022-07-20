import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import useStyles from "./styles";
import Icon from "./icon";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const googleSuccess = async (res) => {
		const token = res?.credential;
		const result = jwt_decode(res?.credential);
		try {
			dispatch({ type: "AUTH", data: { result, token } });
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};
	const googleFailure = (error) => {
		console.log(error);
		console.log(error.details);
		console.log("Google Sign In was unsuccessful. Try Again Later");
	};
	return (
		<GoogleOAuthProvider clientId="405528004980-u4r3sevhsidghsd0l13rc6og5ru2fkf6.apps.googleusercontent.com">
			<GoogleLogin
				onSuccess={googleSuccess}
				onError={googleFailure}
				auto_select
			/>
		</GoogleOAuthProvider>
	);
};

export default GoogleLoginButton;
