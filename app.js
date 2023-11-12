const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

//პორტი
const PORT = process.env.PORT || 3000;

//თემფლეთ ენჯინი
app.set("view engine", "ejs");
app.use(express.static("public"));
//ჰტმლ გაპარსვა პოსტის მოთხოვნის
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/convert-mp3", async (req, res) => {
  const videoId = req.body.videoID;
  if(
    videoId === undefined ||
    videoId === "" ||
    videoId === null
  ){
    return res.render("index", {success : false, message : "Please enter a video ID"});
  }else{
    const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
        "method" : "GET",
        "headers" : {
            "x-repidapi-key" : process.env.API_KEY,
            "x-rapidapi-host" : process.env.API_HOST
        }
    })
    
    const fetchResponse = await fetchAPI.json();
    console.log(fetchResponse)
    if(fetchResponse.status === "ok")
        return res.render("index", {success : true, song_title: fetchResponse.title, song_link : fetchResponse.link})
    else
        return res.render("index", {success: false, message : fetchResponse.msg})
  }
});

//სტარტი
app.listen(PORT, () => {
  console.log(`დეიწყო პორტზე ${PORT}`);
});

