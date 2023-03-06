import { z } from 'zod';

export const AddTodoSchema = z.object({
    title: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),
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
        .optional(),
});

export const UpdateTodoSchema = z.object({
    title: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
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
        .optional(),
});

export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;

export type AddTodo = z.infer<typeof AddTodoSchema>;
