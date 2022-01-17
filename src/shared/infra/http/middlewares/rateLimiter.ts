import { NextFunction, Request, Response } from "express";
import * as redis from "redis";
import { RateLimiterRedis } from "rate-limiter-flexible";

import { AppError } from "@shared/errors/AppError";

export default async function rateLimiter(request: Request, response: Response, next: NextFunction): Promise<void> {
    const redisClient = redis.createClient({
        legacyMode: true,
        socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        }
    });

    await redisClient.connect();

    const limiter = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "middleware",
        points: 10, //5 requests
        duration: 5, // per 5 second per IP
    })

    try {
        await limiter.consume(request.ip);

        return next();
    } catch (error) {
        throw new AppError("Too many requests", 429);
    }
};