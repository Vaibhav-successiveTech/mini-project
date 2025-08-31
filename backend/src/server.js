import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import  pubsub  from "./pubsub.js"; 

import  typeDefs  from "./graphql/typeDefs.js";
import  resolvers  from "./graphql/resolver.js";
import app from "./app.js";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 0;

export async function createExpressServer() {
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({req}) => ({pubsub}) ,
    })
  );

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer(
    {
      schema,
      context: ()=>({pubsub}), 
    },
    wsServer
  );

  return httpServer;
}

const httpServer = await createExpressServer(4000);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Query/Mutation endpoint: http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscription endpoint: ws://localhost:${PORT}/graphql`);
});