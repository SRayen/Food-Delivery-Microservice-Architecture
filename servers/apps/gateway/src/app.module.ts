import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      /*  ApolloGatewayDriver is responsible for connecting to multiple GraphQL services and merging them into a single schema
       using the Apollo Gateway. */
      driver: ApolloGatewayDriver,
      gateway: {
        //SDL (Schema Definition Language) 
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [],
        }),
      },
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
