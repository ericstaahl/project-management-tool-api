import { z } from 'zod';

export const User = z.object({
    username: z.string({ required_error: 'Username required' }).min(5),
    password: z.string({ required_error: 'Password required' }).min(8),
});

export const LoginSchema = z.object({
    username: z.string({ required_error: 'Username required' }).min(5),
    password: z.string({ required_error: 'Password required' }).min(8),
});

export type LoginType = z.infer<typeof LoginSchema>;
