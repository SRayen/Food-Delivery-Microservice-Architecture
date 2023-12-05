"use client";
import { gql, DocumentNode } from "@apollo/client";

export const FORGOT_PASSWORD: DocumentNode = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(forgotPasswordDto: { email: $email }) {
      message
    }
  }
`;

/*
GraphQL Syntax:
query{forgotPassword(forgotPasswordDto:{email:"user@gmail.com"})
{message}
}
*/
