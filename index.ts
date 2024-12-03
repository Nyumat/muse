import chalk from "chalk";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import { connectToDB } from "./lib/database";
import { authMiddleware } from "./lib/middleware";
import authRouter from "./routes/auth";
import songRouter from "./routes/songs";
import usersRouter from "./routes/users";
import { formatDateToPST } from "./util";
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

const colorfulLogger = (req: Request, res: Response, next: Function) => {
  console.log(
    chalk.blue(`[${formatDateToPST(new Date())}]`),
    chalk.green(req.method),
    chalk.yellow(req.url)
  );
  next();
};

app.use(colorfulLogger);

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/", authMiddleware, songRouter);

app.listen(port, async () => {
  await connectToDB();
  console.log(`The server is running at http://localhost:${port}`);
});
