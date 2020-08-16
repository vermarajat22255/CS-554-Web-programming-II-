import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './src/data/schema';

const app = express();
const PORT = 8080;

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.send(`Graph QL is running on port ${PORT}`)
);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(PORT, () =>
    console.log(`your server is running on localhost:${PORT}/graphql`)
);