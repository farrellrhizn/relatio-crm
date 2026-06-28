import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { findById, updatePassword } from "../repositories/user.repository";
import { changePasswordSchema } from "../validations/changePassword.schema";

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const validated = changePasswordSchema.parse(req.body);
    const user = await findById(req.user.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(validated.oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect current password" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(validated.newPassword, 10);
    await updatePassword(user.id, hashedNewPassword);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
