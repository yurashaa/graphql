import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import IconButton from '@mui/material/IconButton';
import ImageIcon from '@mui/icons-material/Image';
import styled from '@emotion/styled';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../../gql/mutations';
import Cookies from 'universal-cookie';
import { GET_ME } from '../../gql/queries';

const StyledAvatar = styled(Avatar)`

	transition: 0.2s;
	&::before {
		opacity: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		content: 'x';
		font-size: 40px;
		transition: 0.2s;
		color: #ffffff;
		cursor: pointer;
	}
	
	&:hover {
		opacity: 0.5;
		&::before {
			opacity: 1;
		}
	}
`;

function Copyright(props: any) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			<Link color="inherit" to="#">
                Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const theme = createTheme();

export const SignUp = () => {
	const navigate = useNavigate();

	const [signUp, { loading }] = useMutation(SIGN_UP, {
		onCompleted: data =>  {
			const cookies = new Cookies();
			cookies.set('token', data.signUp, { path: '/' });

			navigate('/posts');
		},
		refetchQueries: [{ query: GET_ME }]
	});

	const [images, setImages] = useState<ImageListType>([]);

	const onImageChange = (
		imageList: ImageListType,
		addUpdateIndex: number[] | undefined
	) => {
		setImages(imageList);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		await signUp({
			variables: {
				email: data.get('email'),
				password: data.get('password'),
				username: data.get('username'),
				file: images[0]?.file
			}
		});
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
                        Sign Up
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<ImageUploading
							value={images}
							onChange={onImageChange}
						>
							{({
								  imageList,
								  onImageUpload,
								  onImageRemove,
							  }) => (
								<Box display="flex" flexDirection="column" alignItems="center" minHeight="100px" position="relative">
									{imageList.length ?
										imageList.map((image, index) => (
											<StyledAvatar
												key={image.dataURL}
												sx={{ width: '100px', height: '100px' }}
												src={image.dataURL}
												alt="user image"
												onClick={() => onImageRemove(index)}
											/>
										)) : (
											<Avatar sx={{ width: '100px', height: '100px' }}>
												<IconButton onClick={onImageUpload}>
													<ImageIcon />
												</IconButton>
											</Avatar>
										)}
								</Box>
							)}
						</ImageUploading>

						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
                            Sign Up
						</Button>
						<Grid container>
							<Grid item>
								<Link to="/auth/sign-in">
									{'Already have account? Sign In'}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
};