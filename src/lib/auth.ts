import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(SECRET_KEY);
}

export async function verifyToken(token: string | undefined) {
    
    if (!token) {
        throw new Error("Token is required");
    }

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload; 

    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error("Invalid or expired token");
    }
}