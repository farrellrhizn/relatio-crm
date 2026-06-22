import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import customerRoutes from "./routes/customer.route";
import leadRoutes from "./routes/lead.route";
import activityRoutes from "./routes/activity.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/activities", activityRoutes);

export default app;
