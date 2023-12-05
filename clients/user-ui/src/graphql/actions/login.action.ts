"use client";
import { gql, DocumentNode } from "@apollo/client";

export const LOGIN_USER: DocumentNode = gql`
  mutation LoginUser($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      user {
        name
        email
        phone_number
        address
        phone_number
      }
      accessToken
      refreshToken
      error {
        message
      }
    }
  }
`;

/*
GraphQL Syntax:
mutation{
    Login(email:"user@gmail.com",password:"123456")
  {user
   		 {name,
      email,phone_number}
    accessToken,
    refreshToken,
    error{message}
  }
}
*/
