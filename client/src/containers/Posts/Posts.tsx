import React from 'react';
import { useQuery } from '@apollo/client';
import { Box, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

import { GET_POSTS } from '../../gql/queries';
import { IPost } from '../../interfaces';
import { Post } from './Post';


const Wrapper = styled(Box)`
  padding-bottom: 50px;
  margin: 0 auto;
  
  & > *:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const CreateButton = styled(IconButton)`
  width: 300px;
  border-radius: 20px;
  border: 2px solid #f5f5f5;
  margin: 30px auto;
`;

export const Posts = () => {
	const navigate = useNavigate();

	const { data, loading, error } = useQuery<{ posts: IPost[] }>(GET_POSTS, { });

	const createNew = () => navigate('/posts/new');

	if (loading) {
		return <Wrapper  mx="auto" pt="30px"><CircularProgress /></Wrapper>;
	}

	return (
		<Box display="flex" flexDirection="column">
			<CreateButton onClick={createNew}>
				<AddIcon />
			</CreateButton>
			<Wrapper>
				{
					data?.posts.map((post) => <Post key={post.id} {...post} />)
				}
			</Wrapper>
		</Box>
	);
};