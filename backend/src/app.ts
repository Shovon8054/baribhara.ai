import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import routes from "./routes";
import path from "path";

const app = express();


app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(express.json());

app.use('/api', routes);


app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'baribhara-api' });
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'BariBhara API is running' });
});

export default app;
