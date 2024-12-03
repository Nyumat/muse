import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import { connectToDB } from "./lib/database";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
const REQUEST_BODY_SIZE_LIMIT = "50mb";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*", // TODO: Change this to the frontend deployment URL
  })
);
app.use(express.json({ limit: REQUEST_BODY_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_SIZE_LIMIT }));

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Muse API" });
});

app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.listen(port, async () => {
  await connectToDB();
  console.log(`The server is running at http://localhost:${port}`);
});
