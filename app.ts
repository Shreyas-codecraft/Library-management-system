import express from "express";
import {router} from "./userRoutes"; // Adjust the path as needed
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // To parse JSON request bodies
// Use user routes
app.use("/users", router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



