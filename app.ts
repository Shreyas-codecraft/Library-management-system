import express from "express";
import {router} from "./userController"; // Adjust the path as needed
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json()); // To parse JSON request bodies
// Use user routes
app.use(cookieParser());

app.use("/users", router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

  

