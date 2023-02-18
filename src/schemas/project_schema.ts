import { z } from 'zod';

export const AddProjectSchema = z.object({
    title: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),
    number_of_members: z
        .number({
            invalid_type_error: 'Field should be of type number.',
        })
        .optional(),

    start_date: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),
    due_date: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),
});

export type AddProject = z.infer<typeof AddProjectSchema>;
