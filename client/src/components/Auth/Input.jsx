import React from "react";
import { TextField, Grid, InputAdornment, IconButton } from "@material-ui/core";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const Input = ({
	type,
	label,
	name,
	half,
	autoFocus,
	handleChange,
	handlShowPassword,
}) => {
	return (
		<Grid item sx={12} sm={half ? 6 : 12}>
			<TextField
				name={name}
				onChange={handleChange}
				variant="outlined"
				required
				fullWidth
				label={label}
				autoFocus={autoFocus}
				type={type}
				InputProps={
					name === "password" && {
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={handlShowPassword}>
									{type === "password" ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						),
					}
				}
			/>
		</Grid>
	);
};

export default Input;
