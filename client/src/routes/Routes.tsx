import { Route, Routes as Switch, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';


import { Posts, CreatePost } from '../containers';

const FullPage = styled.div`
	min-height: calc(100vh - 164px);
`;

export const Routes = () => {
	return (
		<FullPage>
			<Switch>
				<Route path='/posts' element={<Posts />} />

				<Route path='/posts/new' element={<CreatePost />} />

				<Route path="*" element={<Navigate to="/posts" />} />
			</Switch>
		</FullPage>
	);
};