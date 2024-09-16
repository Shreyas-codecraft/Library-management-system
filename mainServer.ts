import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middleswares/verifyJWT";
import { loginRouter } from "./Routes/auth";
import { logoutRouter } from "./Routes/logout";
import { refreshRouter } from "./Routes/refresh";
import { registerRouter } from "./Routes/register";
import { memberRouter } from "./Routes/member";
import { bookRouter } from "./Routes/books";
import { ensureAdmin } from "./middleswares/ensureAdmin";
// import { redirectToGoogle } from "./controller/redirectToGoogle";
import { googleRouter } from "./Routes/googleOauth";
import { AuthorizeRouter } from "./Routes/googleAuthorize";



const app = express();
const PORT = process.env.PORT || 3500;

// CORS Configuration
app.use(
  cors({  origin: ['http://localhost:5173', 'http://127.0.0.1:5173',"http://localhost:3000"],
    credentials:true})
);

app.use(express.json());
app.use(cookieParser());

// Public Routes (No JWT verification)
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);
app.use("/redirect",googleRouter);
app.use("/authorize",AuthorizeRouter  );


// Apply JWT verification middleware to all routes below this line
// app.use(verifyJWT);

// Protected Routes (Requires JWT and Admin)
app.use("/books",verifyJWT, ensureAdmin, bookRouter);
app.use("/users", verifyJWT,ensureAdmin, memberRouter);

// Example Admin Route
// app.use("/admin", ensureAdmin, adminRouter); // Uncomment and define your admin routes

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
