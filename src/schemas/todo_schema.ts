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

    description: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),
    assignee: z
        .string({
            invalid_type_error: 'Field should be of type string.',
        })
        .optional(),
});

export type AddTodo = z.infer<typeof AddTodoSchema>;
