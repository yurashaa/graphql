import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import ImageIcon from '@mui/icons-material/Image';
import CardMedia from '@mui/material/CardMedia';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { CREATE_POST } from '../../gql/mutations';
import { GET_POSTS } from '../../gql/queries';

export const CreatePost = () => {
	const navigate = useNavigate();

	const [images, setImages] = useState<ImageListType>([]);

	const [create, { loading }] = useMutation(CREATE_POST, { refetchQueries: [{ query: GET_POSTS }] });

	const onImageChange = (
		imageList: ImageListType,
		addUpdateIndex: number[] | undefined
	) => {
		setImages(imageList);
	};

	const createPost = async () => {
		try {
			await create({ variables: { content: 'wow', file: images[0].file } })
				.then(() => navigate('/posts'));
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Box display="flex" justifyContent="center" py="30px">
			<Card sx={{ width: '700px' }}>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
						</Avatar>
					}
					action={<Button onClick={createPost}>Create</Button>}
					title="Shrimp and Chorizo Paella"
					subheader="September 14, 2016"
				/>
				<ImageUploading
					value={images}
					onChange={onImageChange}
				>
					{({
						  imageList,
						  onImageUpload,
					  }) => (
						<Box display="flex" flexDirection="column" alignItems="center" minHeight="400px">
							<IconButton onClick={onImageUpload}>
								<ImageIcon />
							</IconButton>
							{imageList.map((image) => (
								<CardMedia
									key={image.dataURL}
									component="img"
									image={image.dataURL}
									alt="post image"
								/>
							))}
						</Box>
					)}
				</ImageUploading>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
					content
					</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<IconButton aria-label="add to favorites">
						<FavoriteIcon />
					</IconButton>
					<IconButton>
						<ShareIcon />
					</IconButton>
				</CardActions>
			</Card>
		</Box>
	);
};