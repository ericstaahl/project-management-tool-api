import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { ZodError } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { server } from '../server';
import getUserFromJwt from '../utilities/getUserFromJwt';
import { LoginType, User } from '../schemas/user_schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    try {
        const parsedData = User.parse(request.body);

        const userToSave = { ...parsedData };

        try {
            userToSave.password = await bcrypt.hash(userToSave.password, 10);
        } catch (error) {
            return reply.code(500).send({
                message:
                    'An error occured when attempting to hash provided password',
            });
        }

        await prisma.user.create({
            data: userToSave,
        });
        return reply
            .code(201)
            .send({ message: 'User successfully registered.' });
    } catch (error) {
        if (error instanceof ZodError) {
            return reply.code(400).send({ errors: error.flatten() });
        } else if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return reply
                .code(409)
                .send({ message: 'Username is already taken.' });
        } else {
            console.log('special error:', error);
            console.log(
                'instanceof:',
                error instanceof PrismaClientKnownRequestError
            );
            return reply.code(500).send();
        }
    }
}

export async function login(request: LoginRequest, reply: FastifyReply) {
    const parsedData = User.parse(request.body);
    // find user
    console.log(parsedData);
    const user = await prisma.user.findUnique({
        where: {
            username: parsedData.username,
        },
    });
    if (user === null) {
        return reply.code(401).send({
            message: 'Incorrect username or password provided.',
        });
    }
    // get password
    const hashedPassword = user.password;

    // check provided password againt db password
    const res = await bcrypt.compare(parsedData.password, hashedPassword);
    if (res) {
        const { password, ...rest } = user;
        return reply.code(200).send({
            ...rest,
            access_token: server.jwt.sign(
                { user: rest, type: 'access_token' },
                { expiresIn: '4h' }
            ),
            refresh_token: server.jwt.sign(
                { user: rest, type: 'refresh_token' },
                { expiresIn: '12h' }
            ),
        });
    }
    return reply.code(401).send({
        message: 'Incorrect username or password provided.',
    });
}

export async function newToken(request: NewTokenRequest, reply: FastifyReply) {
    const token = request.body.token;
    if (token === undefined) {
        reply.code(400).send({
            message: 'No refresh token provided',
        });
        return;
    }
    server.jwt.verify(token, (err, decoded) => {
        if (err) throw err;
        if (decoded.type === 'refresh_token') {
            console.log(decoded);
            const newAccessToken = server.jwt.sign(
                { user: decoded.user, type: 'access_token' },
                { expiresIn: '4h' }
            );
            reply.code(200).send({
                user: decoded.user,
                access_token: newAccessToken,
            });
        } else {
            reply.code(401).send({
                message: 'The provided token was not a refresh token.',
            });
        }
    });
}

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (!userInfo?.user.user_id) {
            return reply
                .code(401)
                .send({ message: 'No user id present in token.' });
        }

        return reply.send(
            await prisma.user.findMany({
                select: { username: true },
            })
        );
    }
    return reply.code(401).send({ message: 'No access token provided.' });
}

export async function getMembers(
    request: GetMembersRequest,
    reply: FastifyReply
) {
    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        const projectId = Number(request.params.id);

        if (!userInfo?.user.user_id) {
            return reply
                .code(401)
                .send({ message: 'No user id present in token.' });
        }

        return reply.send(
            await prisma.user.findMany({
                select: { user_id: true, username: true },
                where: {
                    users_members: {
                        some: {
                            project_id: { equals: projectId },
                        },
                    },
                },
            })
        );
    }
    return reply.code(401).send({ message: 'No access token provided.' });
}

type LoginRequest = FastifyRequest<{
    Body: LoginType;
}>;

type NewTokenRequest = FastifyRequest<{
    Body: {
        token: string;
    };
}>;

export type GetMembersRequest = FastifyRequest<{
    Params: { id: string };
}>;
