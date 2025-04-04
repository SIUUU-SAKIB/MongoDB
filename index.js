require(`dotenv`).config();
const express = require(`express`);
const app = express();
const port = process.env.PORT || 1000;
const cors = require(`cors`);
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y1e7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(
  cors({ credentials: true, origin: `http://localhost:${process.env.ORIGIN}` })
);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB and Nekane"
    );

    const carCollection = client.db("Rent-car").collection(`added-car`);
    app.get(`/car`, async (req, res) => {
      const data = await carCollection.find().toArray();
      res.send(data.filter(e => e.model.toLowerCase() === `hyundai elantra`));
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get(`/`, (req, res) => {
  res.send(`SERVER IS WORKING`);
});

app.listen(port, () =>
  console.log(`SERVER IS RUNNING ON http://localhost:${port}`)
);
