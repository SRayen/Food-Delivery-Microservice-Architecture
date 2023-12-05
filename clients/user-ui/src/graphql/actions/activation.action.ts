"use client";
import { gql, DocumentNode } from "@apollo/client";

export const ACTIVATE_USER: DocumentNode = gql`
  mutation ActivateUser($activationToken: String!, $activationCode: String!) {
    activateUser(
      activationDto: {
        activationToken: $activationToken
        activationCode: $activationCode
      }
    ) {
      user {
        name
        email
        phone_number
        createdAt
      }
    }
  }
`;

/*
GraphQL Syntax:
mutation{
  activateUser(
    activationDto: {activationToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJyYXllbiBzIiwiZW1haWwiOiJzZWxtYW5lcmF5ZW5lOTVAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkdG1MMm9iWVYzWkpCcy80NzdaM0tsLnFjdExqTE9raEdwcDlZL3dYeDlwVktnSW1kcGdnRTYiLCJwaG9uZV9udW1iZXIiOjExMTExMTExfSwiYWN0aXZhdGlvbkNvZGUiOiI0MTcyIiwiaWF0IjoxNzAxMTcwNTU3LCJleHAiOjE3MDExNzA4NTd9.NAqY1KQoVxsI8GIl1_HKHdv9LihNIpPguaXoDmwjWLI",
    activationCode:"4172"
    }) 
  {
    user{
   				 name,
   				 email,
   				 password,phone_number
  }}
    
 
}
*/
