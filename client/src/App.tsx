import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme } from '@mui/material';
import { Global, css } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'universal-cookie';

import { Footer, Header } from './components';
import { Routes } from './routes';

const cookies = new Cookies();

const authLink = setContext((_, { headers }) => {
	const token = cookies.get('token');

	return {
		headers: {
			...headers,
			authorization: token || '',
		}
	};
});

const client = new ApolloClient({
	link: authLink.concat(createUploadLink({ uri: `${process.env.REACT_APP_API_URL}/graphql` })),
	cache: new InMemoryCache(),
});

const global = css`
  * {
	  margin: 0;
	  padding: 0;
  }
`;

const theme = createTheme();

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Global styles={global} />
			<ApolloProvider client={client}>
				<BrowserRouter>
					<Header />
					<Routes />
					<Footer />
				</BrowserRouter>
			</ApolloProvider>
		</ThemeProvider>
	);
}

export default App;
