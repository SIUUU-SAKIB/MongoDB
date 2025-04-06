require(`dotenv`).config();
const express = require(`express`);
const app = express();
const port = process.env.PORT || 1000;
const cors = require(`cors`);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
      "Pinged your deployment. You successfully connected to MongoDB"
    );

    const dataBase = client.db(`my-database`);
    const usersCollection = dataBase.collection(`users-collection`);

    app.post(`/add-user`, async (req, res) => {
      try {
        const result = await usersCollection.insertMany(req.body);
        console.log(req.body);
        res.status(200).json({
          message: `User created successfully`,
          result,
        });
      } catch (error) {
        res.status(400).json({ message: `Failed to create user` });
      }
    });

    app.get(`/users`, async (req, res) => {
      try {
        const data = await usersCollection.find().toArray();
        res.send(data);
      } catch (error) {
        res.status(400).json({
          message: `failed to get data`,
          error,
        });
      }
    });
    // search via ID
    app.get(`/users/:id`, async (req, res) => {
      try {
        const { id } = req.params;
        const data = await usersCollection.findOne({ _id: new ObjectId(id) });

        res.send(data);
      } catch (error) {
        res.status(400).json({ message: `Failed to get the data` }, error);
      }
    });

    // serach via Email
    app.get(`/users/user/:email`, async (req, res) => {
      try {
        const data = await usersCollection
          .find({ email: req.params.email }, { projection: { email: 0 } })
          .toArray();
        res.status(200).json({
          status: `Success`,
          message: `Successfully Got the data`,
          data: data,
        });
      } catch (error) {
        res.status(400).json({ message: `Failed to get data` });
      }
    });

    // update items
    app.put(`/update-user/:id`, async (req, res) => {
      const { id } = req.params;
      try {
        const filter = { _id: new ObjectId(id) };
        const userInfo = req.body;
        const updateInfo = {
          $set: {
            ...userInfo,
          },
        };
        const option = { upsert: false };
        const result = await usersCollection.updateOne(
          filter,
          updateInfo,
          option
        );
        res.json(result);
      } catch (error) {
        res.status(400).json({
          message: `Failed to update user`,
          error,
        });
      }
    });
    // update many
    app.patch(`/update-all`, async (req, res) => {
      try {
        const result = await usersCollection.updateMany({}, { $set: { status: "pending" } });
        res.status(200).json({
          result
        })
      } catch (error) {
        res.status(400).json({
          message: `Failed to update user`,
          error,
        });
      }
    });
    // Default Route
    app.get(`/`, (req, res) => {
      res.send("SERVER IS WORKING");
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () =>
  console.log(`SERVER IS RUNNING ON http://localhost:${port}`)
);
