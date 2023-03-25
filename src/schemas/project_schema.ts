import { z } from 'zod';

export const AddProjectSchema = z.object({
    title: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),
    start_date: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),
    due_date: z.string({
        required_error: 'Field is required.',
        invalid_type_error: 'Field should be of type string.',
    }),
    description: z
        .string({
            invalid_type_error: 'Field should be of type string',
        })
        .max(500, 'Max 500 characters is allowed.')
        .optional(),
});

export type AddProject = z.infer<typeof AddProjectSchema>;

export const UpdateProjectSchema = z.object({
    title: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .optional(),
    start_date: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .optional(),
    due_date: z
        .string({
            required_error: 'Field is required.',
            invalid_type_error: 'Field should be of type string.',
        })
        .optional(),
    description: z
        .string({
            invalid_type_error: 'Field should be of type string',
        })
        .max(500, 'Max 500 characters is allowed.')
        .optional(),
    complete: z
        .boolean({
            invalid_type_error: 'Field should be of type boolean',
        })
        .optional(),
});

export const InviteUserSchema = z.object({
    username: z.string({
        required_error: 'userId is required.',
        invalid_type_error: 'userId should be of type string.',
    }),
});

export type InviteUser = z.infer<typeof InviteUserSchema>;

export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
