import { getCsvRecords } from '@/lib/get-csv-records';
import { Resolvers } from '@/model/gql-server-resolvers-types';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { readFileSync } from 'node:fs';

function getData() {
  // todo: when session is implemented, update this function
  return getCsvRecords();
}

const resolvers: Resolvers = {
  Query: {
    statuses: async () => {
      const data = await getData();
      const resultObject: Record<string, number> = {};
      for (const { status } of data) {
        if (status in resultObject) resultObject[status] += 1;
        else resultObject[status] = 1;
      }
      const resultArr = Object.entries(resultObject).map(([name, count]) => ({ name, count }));
      return resultArr;
    },
    priorities: async () => {
      const data = await getData();
      const resultObject: Record<string, number> = {};
      for (const { priority } of data) {
        if (priority in resultObject) resultObject[priority] += 1;
        else resultObject[priority] = 1;
      }
      const resultArr = Object.entries(resultObject).map(([name, count]) => ({ name, count }));
      return resultArr;
    },
  },
};

const typeDefs = readFileSync('src/model/schema.graphql', 'utf8');

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(server);

// todo : add context when use plan to manipulate table data
// use user session
// import { NextRequest } from 'next/server';
// export default startServerAndCreateNextHandler<NextRequest>(server, {
//   context: async (req, res) => ({ req, res, user: await getLoggedInUser(req) }),
// });
