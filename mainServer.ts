import express from "express";
const app = express();
// const path = require('path');
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3500;
import { verifyJWT } from "./middleswares/verifyJWT";
import { loginRouter } from "./Routes/auth";
import { logoutRouter } from "./Routes/logout";
import { refreshRouter } from "./Routes/refresh";
import { registerRouter } from "./Routes/register";
import { memberRouter } from "./Routes/member";
import { bookRouter } from "./Routes/books";
import { ensureAdmin } from "./middleswares/ensureAdmin";
// built-in middleware for json 

app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files

// routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);
app.use(verifyJWT);  
app.use(ensureAdmin)
app.use("/books",bookRouter)
app.use("/users",memberRouter)

// app.use('/employees', require('./routes/api/employees'));

// app.all('*', (req, res) => {
//     res.status(404);
//     if (req.accepts('html')) {
//         res.sendFile(path.join(__dirname, 'views', '404.html'));
//     } else if (req.accepts('json')) {
//         res.json({ "error": "404 Not Found" });
//     } else {
//         res.type('txt').send("404 Not Found");
//     }
// });


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));