import chalk from "chalk";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import path from 'path';
import { connectToDB } from "./lib/database";
import { authMiddleware, refreshTokenMiddleware } from "./lib/middleware";
import authRouter from "./routes/auth";
import playlistRouter from "./routes/playlists";
import songRouter from "./routes/songs";
import usersRouter from "./routes/users";
import { formatDateToPST } from "./util/index";

const REQUEST_BODY_SIZE_LIMIT = "50mb";
const __dirname = import.meta.dirname;
const port = process.env.PORT || 3000;
const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "img-src": ["'self'", "data:", "https:"],
            },
        },
    })
);
app.use(
    cors({
        origin: "*", // TODO: Change this to the frontend deployment URL
    })
);
app.use(express.json({ limit: REQUEST_BODY_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_SIZE_LIMIT }));

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.svg') {
            res.setHeader('Content-Type', 'image/svg+xml');
        }
    }
}));

app.get('/', (_: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
app.use("/api", playlistRouter);
app.use("/", authMiddleware, songRouter);
app.use("/refresh-token", refreshTokenMiddleware);

app.listen(port, async () => {
    await connectToDB();
    console.log(`The server is running at http://localhost:${port}`);
});
