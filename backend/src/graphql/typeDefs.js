import gql from 'graphql-tag';

export default gql`

  scalar Upload
  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }


  type Message {
    id: ID!
    sender: User!
    receiver: User!
    text: String!
    createdAt: String!
  }

  type Post{
    id:ID!
    user:User!
    text:String!
    avatar:String
    likes:[User!]!
    comments:[Comment!]!
    date:String!
  }

  type Comment{
    user:User!
    text:String!
  }


  type Query {
    getMessages(sender: ID!,receiver:ID!): [Message!]!
    getPosts:[Post!]!
    getLikes(postId:ID!):[User!]!
  }

  type Mutation {
    sendMessage(sender: ID!, receiver: ID!, text: String!): Message!
    sendPost(userId:String!,text:String!, avatar:String):Post!
    likePost(postId:ID!,userId:ID!):[User]!
  }

  type likePayload {
    likes: [User]!
    postId:ID!
  }

  type Subscription {
    messageSent: Message!
    post:Post!
    likes(postId:ID!):likePayload
  }
`;
