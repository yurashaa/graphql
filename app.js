import express from 'express';
import { graphqlHTTP } from 'express-graphql';

import { queryRootSchema } from './schemas/index.js';

const app = express();

app.use('/api', graphqlHTTP({
    schema: queryRootSchema,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log('Listening on 4000...')
})
