import { getCsvRecords, transformSerializableTasks } from '@/lib/get-csv-records';
import { Resolvers } from '@/model/gql-server-resolvers-types';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const resolvers: Resolvers = {
  Query: {
    statuses: async () => {
      const records = await getCsvRecords();
      const data = transformSerializableTasks(records);
      const resultObject: Record<string, number> = {};
      for (const { status } of data) {
        if (status in resultObject) resultObject[status] += 1;
        else resultObject[status] = 1;
      }
      const resultArr = Object.entries(resultObject).map(([name, count]) => ({ name, count }));
      return resultArr;
    },
    priorities: async () => {
      const records = await getCsvRecords();
      const data = transformSerializableTasks(records);
      const resultObject: Record<string, number> = {};
      for (const { priority } of data) {
        if (priority in resultObject) resultObject[priority] += 1;
        else resultObject[priority] = 1;
      }
      const resultArr = Object.entries(resultObject).map(([name, count]) => ({ name, count }));
      return resultArr;
    },
    estimatedHour: async () => {
      const records = await getCsvRecords();
      const data = transformSerializableTasks(records);
      const estHrList = data.map((d) => d.estimated_hours);
      return {
        min: Math.min(...estHrList),
        max: Math.max(...estHrList),
      };
    },
  },
};

const typeDefs = readFileSync(path.resolve(process.cwd(), 'src', 'model', 'schema.graphql'), 'utf8');

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
