const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   methodOverride((req) => {
//     console.log(req.files);
//     return req.body._method;
//   })
// );

const UserRouter = require("./Routes/UserRouter");
const EventsRouter = require("./Routes/EventsRouter");
const CategoriesRouter = require("./Routes/CategoriesRouter");
app.use("/api/users", UserRouter);
app.use("/api/events", EventsRouter);
app.use("/api/categories", CategoriesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
