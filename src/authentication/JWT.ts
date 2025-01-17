import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const generatedToken = async (email:string) => {
    

    const privateSecret: string = process.env.TOKEN_SECRET || "";
    
    try {
        const token = jwt.sign({
            type: 'login-user-aukt',
            email
        },
            privateSecret,
            {
                expiresIn: '48h',
            });

        return token

    } catch (error: any) {
        
        return error
    }
};

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const privateSecret: string = process.env.TOKEN_SECRET || "";

    try {
        
        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            res.status(401).json({ message: "Token não fornecido" })
            return;
        }

        jwt.verify(token, privateSecret)

        next();
    } catch (error: any) {
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({ message: "Token inválido" }); 
        } else if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token expirado, faça login novamente" }); 
        } else {
            res.status(500).json({ message: "Erro ao verificar o token" }); 
        }
    }
};