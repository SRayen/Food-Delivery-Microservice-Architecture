//GraphQL Setup Code:

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

import Cookies from "js-cookie";

//Simple Setup:
// export const graphqlClient=new ApolloClient({
//     uri:process.env.NEXT_PUBLIC_SERVER_URI,
//     cache:new InMemoryCache()
// })

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URI,
});

const authMiddleware = new ApolloLink((oparetion, forward) => {
  oparetion.setContext({
    headers: {
      accesstoken: Cookies.get("access_token"),
      refreshtoken: Cookies.get("refresh_token"),
    },
  });
  return forward(oparetion);
});

export const graphqlClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
});