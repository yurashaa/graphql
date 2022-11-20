import { Route, Routes as Switch, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/client';

import { Posts, CreatePost, SignIn, SignUp } from '../containers';
import { GET_ME } from '../gql/queries';

const FullPage = styled.div`
	min-height: calc(100vh - 164px);
`;

export const Routes = () => {
	const { data, loading, error } = useQuery(GET_ME);
	console.log(data);
	return (
		<FullPage>
			<Switch>
				<Route path='/auth/sign-in' element={<SignIn />} />

				<Route path='/auth/sign-up' element={<SignUp />} />

				<Route path='/posts' element={<Posts />} />

				<Route path='/posts/new' element={<CreatePost />} />

				<Route path="*" element={<Navigate to="/posts" />} />
			</Switch>
		</FullPage>
	);
};