import { gql } from 'apollo-server-koa'

export default gql`

  type Query {
    _: String
  }

  type Mutation {
    _: String 
  }

  type Subscription {
    _: String
  }
`
