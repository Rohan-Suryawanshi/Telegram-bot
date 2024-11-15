// const express = require("express");
// const app = express();
// const axios = require("axios");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.post("/new-message", (req, res) => {
//    const { message } = req.body;

//    if (!message || message.text.toLowerCase().indexOf("marco") < 0) {
//       return res.status(200).end();
//    }

//    axios
//       .post(
//          "https://api.telegram.org/7684920170:AAFTmaqY5tUM2r2lAsXN84L4-HHZOlb3ems/sendMessage",
//          {
//             chat_id: message.chat.id,
//             text: "Hello Bro!",
//          }
//       )
//       .then((response) => {
//          // We get here if the message was successfully posted
//          console.log("Message posted");
//          res.end("ok");
//       })
//       .catch((err) => {
//          // ...and here if it was not
//          console.log("Error :", err);
//          res.end("Error :" + err);
//       });
// });

// app.listen(3000, function () {
//    console.log("Telegram app listening on port 3000!");
// });


require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

// Middleware to validate Telegram message structure
function validateMessage(req, res, next) {
   const { message } = req.body;
   if (!message || !message.text || !message.chat || !message.chat.id) {
      return res.status(400).send("Invalid message format");
   }
   req.message = message;
   next();
}

app.post("/new-message", validateMessage, (req, res) => {
   const { text, chat } = req.message;

   if (text.toLowerCase().indexOf("marco") < 0) {
      return res.end(); // Do nothing if "marco" is not found
   }

   axios
      .post(TELEGRAM_API_URL, {
         chat_id: chat.id,
         text: "Polo!!",
      })
      .then(() => {
         console.log("Message posted successfully");
         res.end("ok");
      })
      .catch((err) => {
         console.error("Error posting message:", err.message);
         res.status(500).send("Error posting message");
      });
});

app.listen(3000, () => {
   console.log("Telegram app listening on port 3000!");
});
