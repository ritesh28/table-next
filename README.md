nextjs
zod

- use it to check data coming from the external source.
- Support class (but not interface) as a type to property. Do not use it. Instead use `z.transform()` to convert the input
- For un-serialized object - first create serialized schema, then transform
- in zod, optional and undefined are different

shadCN
graphql
immer
moment
webpack loader: csv & graphql

## TODO

title column re-size
Advanced search
In-memory DB
===crud operation===
auth rbac - web-simplified

### To run a ts file in a standalone fashion

```bash
# convert .ts to .js
node_modules/.bin/tsc src/model/task.ts --moduleResolution nodenext --module nodenext
# run .js file
node src/model/task.js
```
