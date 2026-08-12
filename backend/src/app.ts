import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();


app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);
app.use(compression());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src/uploads"))
);

// Older seeded properties reference images that may not exist on disk.
// Serve a lightweight placeholder instead of returning a broken image/404.
app.get("/uploads/properties/:filename", (_req: Request, res: Response) => {
  res
    .status(200)
    .type("image/svg+xml")
    .send(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" role="img" aria-label="Property image unavailable">
        <rect width="800" height="560" fill="#e2e8f0"/>
        <path d="M170 400l135-145 92 94 72-76 161 127H170z" fill="#94a3b8"/>
        <circle cx="290" cy="165" r="46" fill="#f8fafc"/>
        <text x="400" y="485" text-anchor="middle" fill="#475569" font-family="Arial, sans-serif" font-size="30">Property image unavailable</text>
      </svg>
    `);
});

app.use(express.json());

app.use('/api', routes);


app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'baribhara-api' });
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'BariBhara API is running' });
});

export default app;
