"use client";
import { gql, DocumentNode } from "@apollo/client";

export const RESET_PASSWORD: DocumentNode = gql`
  mutation resetPassword($password: String!, $activationToken: String!) {
    resetPassword(
      resetPasswordDto: {
        password: $password
        activationToken: $activationToken
      }
    ) {
      user {
        name
        email
        phone_number
      }
    }
  }
`;

/*
GraphQL Syntax:
query{resetPassword(resetPasswordDto:{password:"11110000",activationToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2ZDNmMzA3M2Q2ZWU1MzdiM2IwZDQ5IiwibmFtZSI6IlJheWVuIFNlbG1lbiIsImVtYWlsIjoic2VsbWFuZXJheWVuZTk1QGdtYWlsLmNvbSIsInBob25lX251bWJlciI6OTU3MzA3NTcsImFkZHJlc3MiOm51bGwsInBhc3N3b3JkIjoiJDJiJDEwJGlHYS5OMlBMcVdrNEx5MlVFYkU5bS4xTkFKWjMvdkVnUWowTm9CeDIycTlZZXFzOTAzT2NxIiwicm9sZSI6IlVzZXIiLCJjcmVhdGVkQXQiOiIyMDIzLTEyLTA0VDAyOjUzOjM2LjI3MFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTEyLTA0VDAyOjUzOjM2LjI3MFoifSwiaWF0IjoxNzAxNzI3OTAxLCJleHAiOjE3MDE3MjgyMDF9.uRaFaAH5F3whadad_n6LnadgF0y-siOe48wXEX4XHcnB-WkuAw"})
{user{name,email,phone_number}}
}
*/
