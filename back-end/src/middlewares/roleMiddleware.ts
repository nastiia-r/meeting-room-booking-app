import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkRole = (requiredRole: 'admin' | 'user') => {
    return (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers["authorization"];
      if (!authHeader) return res.status(401).json({ message: "No token provided" });
  
      const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });
  
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
  
        if (decoded.role !== requiredRole) {
          return res.status(403).json({ message: "Access denied: insufficient permissions" });
        }
  
        (req as any).user = decoded; 
        next();
      });
    };
  };
  