import { gql } from "@apollo/client";

const fetchMessages = gql`
   query Query($getMessagesSender2: ID!, $getMessagesReceiver2: ID!) {
  getMessages(sender: $getMessagesSender2, receiver: $getMessagesReceiver2) {
    text
    id
    createdAt
    sender {
      id
    }
    receiver {
      id
    }
  }
}`

const sendMessage = gql`
    mutation Mutation($text: String!, $receiver: ID!, $sender: ID!) {
  sendMessage(text: $text, receiver: $receiver, sender: $sender) {
    text
    sender {
      name
      id
    }
    receiver {
      name
      id
    }
    id
    createdAt
  }
}
`

const subscription = gql`
    subscription MessageSent {
  messageSent {
    text
    sender {
      id
      name
    }
    receiver {
      name
      id
    }
    id
    createdAt
  }
}
`
const getPost = gql`
query GetPosts {
  getPosts {
    text
    id
    date
    avatar
    user {
      id
      name
      avatar
    }
    comments {
      user {
        name
        avatar
      }
      text
    }
    likes {
      id
    }
  }
}`

const sendPost = gql`
mutation Mutation($text: String!, $avatar: String, $userId: String!) {
  sendPost(text: $text, avatar: $avatar, userId: $userId) {
    user {
      name
      avatar
      id
    }
    text
    id
    date
    avatar
    comments {
      user {
        name
        avatar
      }
      text
    }
    likes {
      id
    }
  }
}`

const postSubscription = gql`
  subscription Subscription {
  post {
    user {
      name
      id
      avatar
    }
    text
    id
    date
    avatar
    likes {
      name
    }
    comments {
      user {
        name
        avatar
      }
      text
    }
  }
}
`

const getLikes = gql`
query GetLikes($postId: ID!) {
  getLikes(postId: $postId) {
    name
    id
  }
}
`
const postLike = gql`
mutation Mutation($postId: ID!, $userId: ID!) {
  likePost(postId: $postId, userId: $userId) {
    name
    id
  }
}
`
const likeSubscription = gql`
subscription Subscription($likesPostId2: ID!) {
  likes(postId: $likesPostId2) {
    postId
    likes {
      name
      id
    }
  }
}
`

// const 

export {
  fetchMessages, sendMessage, subscription, getPost, postSubscription,
  postLike, likeSubscription, sendPost, getLikes
};