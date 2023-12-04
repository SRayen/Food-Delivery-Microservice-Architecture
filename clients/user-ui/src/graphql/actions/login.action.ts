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
