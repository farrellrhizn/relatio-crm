import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import customerRoutes from "./routes/customer.route";
import leadRoutes from "./routes/lead.route";
import activityRoutes from "./routes/activity.route";
import dashboardRoutes from "./routes/dashboard.route";
import companyRoutes from "./routes/company.route";
import taskRoutes from "./routes/task.route";
import opportunityRoutes from "./routes/opportunity.route";
import proposalRoutes from "./routes/proposal.route";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/proposals", proposalRoutes);

app.use(globalErrorHandler);

export default app;
