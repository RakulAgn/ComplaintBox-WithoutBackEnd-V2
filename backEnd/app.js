const { MongoClient } = require("mongodb");   // To restore data in server
let express = require("express");                    // Backbone // Engine
var cors = require("cors");     // Policy handler

const app = express();

// Request -- Everything happend in frontend

// Response -- Everything happend in backend

const mongoDbUrl = "mongodb+srv://MonkAno:MonkAno@cluster0.cfvup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


// -------------------------------
// assist functions

function makeId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function dateAndTime() {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes();
  let cdata = date + " / " + time;
  return cdata;
}
// -------------------------------





app.get("/submit", (req, res) => {
  let Title = req.query.complaintTitle;
  let Text = req.query.complaintDiscretion;
  let myData = {
    ComplaintTitle: Title,
    ComplaintText: Text,
    ComplaintId: makeId(6),
    ComplaintTime: dateAndTime(),
    ComplaintUpVotes: 0,
    ComplaintDownVotes: 0,
    totalVotes: 0,
  };

  async function createListing(client, newListing, response) {
    const result = await client
      .db("sample")
      .collection("students")
      .insertOne(newListing); // MongoDB Function

    if (result.acknowledged === true) {
      res.send(
        "<script>alert('Your Complaint is recorded '); window.location.href = 'http://127.0.0.1:5500/frontEnd/index.html'; </script>"
      );   // window.location.href = page redircetor
    } else {
      console.log("Data Not Inserted");
      response.json({ status: false });
    }
  }

  async function main() {
    const uri = mongoDbUrl;


    const client = new MongoClient(uri);

    try {
      await client.connect();
      const pen = await createListing(client, myData, res);
    } catch (e) {
      console.log("test");
      console.error(e);
    } finally {
      await client.close();
    }
  }
  main().catch(console.error);
});






app.get("/trend", cors(), (req, res) => {
  async function findListings(client) {
    const cursor = client.db("sample").collection("students").aggregate( //aggregate function or data handler
      [
        { $sort: { totalVotes: -1 } } //-1 is for reverse
      ]
    );
    const results = await cursor.toArray();
    res.json(results);
    console.log(results);
  }

  async function main() {
    const uri = mongoDbUrl;

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const pen = await findListings(client, res);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  main().catch(console.error);
});






app.get("/showall", cors(), (req, res) => {
  async function findListings(client) {
    const cursor = client.db("sample").collection("students").find(); // find to display all the collected values
    const results = await cursor.toArray();
    res.json(results);
  }

  async function main() {
    const uri = mongoDbUrl;

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const pen = await findListings(client, res);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  main().catch(console.error);
});





app.get("/showOne", cors(), (req, res) => {
  let postNUmber = req.query.cid; //aswq213

  async function findListings(client) {
    const cursor = client.db("sample").collection("students").find({ "ComplaintId": postNUmber }); //asw..
    const results = await cursor.toArray();
    res.json(results);
    // console.log(results);
  }

  async function main() {
    const uri = mongoDbUrl

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const pen = await findListings(client, res);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  main().catch(console.error);
});




app.get("/VoteDown", (req, res) => {
  let cid = req.query.cid; //asw213


  // Reading the data
  async function UpdateDownVote(client) {
    const cursor = await client.db("sample").collection("students").updateOne( // updateone field in database
      {
        ComplaintId: cid
      },
      {
        $inc: // Data Incrementer
        {
          totalVotes: 1,
          ComplaintDownVotes: 1
        }
      });

    console.log("data")
  }

  async function main() {
    const uri = mongoDbUrl;

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const pen = await UpdateDownVote(client, res);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  main().catch(console.error);

  // end reading
});



app.get("/VoteUp", (req, res) => {
  let cid = req.query.cid;


  // Reading the data
  async function UpdateDownVote(client) {
    const cursor = await client.db("sample").collection("students").updateOne(
      {
        ComplaintId: cid
      },
      {
        $inc:
        {
          totalVotes: 1,
          ComplaintUpVotes: 1
        }
      });

    console.log("data")
  }

  async function main() {

    const uri = mongoDbUrl;

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const pen = await UpdateDownVote(client, res);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  main().catch(console.error);

  // end reading
});





const port = 9099;
app.listen(port, () => console.log(`Listening on port ${port}..`));
