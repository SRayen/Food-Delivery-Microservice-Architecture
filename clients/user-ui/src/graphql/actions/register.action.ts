"use client";
import { gql, DocumentNode } from "@apollo/client";

export const REGISTER_USER: DocumentNode = gql`
  mutation RegisterUser(
    $name: String!
    $email: String!
    $password: String!
    $phone_number: Float!
  ) {
    register(
      registerDto: {
        name: $name
        email: $email
        password: $password
        phone_number: $phone_number
      }
    ) {
      activation_token
    }
  }
`;

/*
GraphQL Syntax:
mutation{register(registerDto:
  {name:"user",
    email:"user@gmail.com",
    password:"123456",
    phone_number:22222222})
		{
      activation_token
    }
}
*/
