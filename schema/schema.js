const axios = require('axios')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then( ({data}) => data )
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args){
        /* parentValue gives us access to the root node, off of which we can pull
        the companyId to make a query */
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then( ({data})  => data)
      }
    }
  })
})

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // simulate a DB query with lodash _.find which returns the first match
        // GraphQL handles casting raw JSON or a raw JS object into GraphQL types
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then( ({data}) => data  )
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then( ({data}) => data)
      }
    }
  })
})

/* In Mutation, we pass type UserType to addUser because it is the type of data
 that this mutation should return
  The NonNull wrapper will validate that this field is not null. 
*/ 
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, companyId }){
        return axios.post(`http://localhost:3000/users`, { firstName, age })
          .then(({data}) => data)
      }
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, { id }){
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(({data}) => data)
      }
    },
    updateUser: {
      type: UserType,
      args: { 
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }  
      },
      resolve(parentValue, args){
        // JSONServer ignores the id parameter in args when updating that entry
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(({data}) => data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query,
  mutation
})