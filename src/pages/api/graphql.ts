import { getCsvRecords, transformSerializableTasks } from '@/lib/util-get-csv-records';
import { Resolvers } from '@/model/gql-server-resolvers-types';
import typeDefs from '@/model/schema.graphql';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

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
    labels: async () => {
      const records = await getCsvRecords();
      const data = transformSerializableTasks(records);
      const resultObject: Record<string, number> = {};
      for (const { label } of data) {
        if (label in resultObject) resultObject[label] += 1;
        else resultObject[label] = 1;
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
