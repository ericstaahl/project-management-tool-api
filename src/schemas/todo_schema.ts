import { z } from 'zod';

const statuses = ['NOT_STARTED', 'IN_PROGRESS', 'DONE'] as const;

export const AddTodoSchema = z.object({
    title: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .min(3, 'Min. 3 characters')
        .max(20, 'Max 20 characters'),
    estimate: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),

    description: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .max(500, 'Max 500 characters is allowed.'),
    assignee: z
        .string({
            invalid_type_error: 'Field should be of type string.',
        })
        .nullable()
        .optional(),
});

export const UpdateTodoSchema = z.object({
    title: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .min(3, 'Min. 3 characters')
        .max(20, 'Max 20 characters')
        .optional(),
    estimate: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .optional(),
    description: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .max(500, 'Max 500 characters is allowed.')
        .optional(),
    assignee: z
        .string({
            invalid_type_error: 'Field should be of type string.',
        })
        .nullable()
        .optional(),
    status: z
        .enum(statuses, {
            invalid_type_error: `Field should have the one of the following values: ${statuses.toString()}`,
        })
        .optional(),
});

export const AddTodoCommentSchema = z.object({
    content: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .min(10, 'Min. 10 characters')
        .max(200, 'Max 200 characters'),
});

export type AddTodoComment = z.infer<typeof AddTodoCommentSchema>;

export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;

export type AddTodo = z.infer<typeof AddTodoSchema>;
