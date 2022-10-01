import graphql, { GraphQLObjectType, GraphQLSchema } from 'graphql';

const QueryRoot = new GraphQLObjectType({
    name: 'QueryRoot',
    fields: {
        hello: {
            type: graphql.GraphQLString,
            resolve: () => 'Hello world'
        },
        wow: {
            type: graphql.GraphQLInt,
            resolve: () => Math.ceil(Math.random() * 1000)
        }
    }
})

export const queryRootSchema = new GraphQLSchema({ query: QueryRoot })
