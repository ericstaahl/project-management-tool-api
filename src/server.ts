import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import autoLoad from '@fastify/autoload';
import path from 'path';
import * as dotenv from 'dotenv';
import fastifyJwt from '@fastify/jwt';

dotenv.config();

export const server = fastify({ logger: true });

declare module 'fastify' {
    export interface FastifyInstance {
        verifyJwt: (request: FastifyRequest, reply: FastifyReply) => any;
    }
}

const ALLOWED_HOSTNAME = process.env.ALLOWED_HOSTNAME;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const PORT = Number(process.env.PORT);
const HOST = process.env.HOST as string;

server.register(cors, {
    origin: (origin, cb) => {
        const hostname = new URL(origin).hostname;
        if (hostname === ALLOWED_HOSTNAME) {
            cb(null, true);
            return;
        }
        cb(new Error('Not allowed'), false);
    },
});

if (ACCESS_TOKEN_SECRET) {
    server.register(fastifyJwt, { secret: ACCESS_TOKEN_SECRET });
} else {
    console.error('No access token secret provided. Check env variables.');
    process.exit(1);
}

server.decorate(
    'verifyJwt',
    async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            return reply.send(error);
        }
    }
);

server.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
});

const start = async () => {
    try {
        await server.listen({ port: PORT, host: HOST });
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();
