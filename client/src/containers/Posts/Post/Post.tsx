import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { IPost } from '../../../interfaces';

export const Post = ({ id, image, user, content }: IPost) => {
	const imageLink = `${process.env.REACT_APP_API_URL}/images/${image}`;

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const shareFacebook = () => {
		window.open('https://www.facebook.com/sharer.php?u=https://graphql.org/', '_blank');
		handleClose();
	};


	const shareTwitter = () => {
		window.open(`https://twitter.com/intent/tweet?url=https://graphql.org/&text=${content}`, '_blank');
		handleClose();
	};

	const shareLinkedin = () => {
		window.open(`https://www.linkedin.com/shareArticle?url=https://graphql.org/&summary=${content}`, '_blank');
		handleClose();
	};

	return (
		<Card sx={{ width: '700px' }}>
			<CardHeader
				avatar={
					<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
					</Avatar>
				}
				title="Shrimp and Chorizo Paella"
				subheader="September 14, 2016"
			/>
			{image && <CardMedia
				component="img"
				image={imageLink}
				alt="post image"
			/>}
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{content}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton aria-label="add to favorites">
					<FavoriteIcon />
				</IconButton>
				<IconButton
					aria-label="share"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
				>
					<ShareIcon />
				</IconButton>
				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem onClick={shareFacebook}>Facebook</MenuItem>
					<MenuItem onClick={shareTwitter}>Twitter</MenuItem>
					<MenuItem onClick={shareLinkedin}>LinkedIn</MenuItem>
				</Menu>
			</CardActions>
		</Card>
	);
};