import dayjs from 'dayjs';
import { z } from 'zod';

export const AddProjectSchema = z
    .object({
        title: z
            .string({
                required_error: 'Field is required.',
                invalid_type_error: 'Field should be of type string.',
            })
            .min(3, 'Min. 3 characters')
            .max(20, 'Max 20 characters'),
        start_date: z.coerce.date({
            invalid_type_error: 'Field should be formatted as a valid date',
        }),
        due_date: z.coerce.date({
            invalid_type_error: 'Field should be formatted as a valid date',
        }),
        description: z
            .string({
                invalid_type_error: 'Field should be of type string',
            })
            .max(500, 'Max 500 characters is allowed.')
            .optional(),
    })
    .refine(
        (val) => {
            return dayjs(val.due_date).diff(val.start_date) >= 0 ? true : false;
        },
        { message: 'Due date cannot be before start date.' }
    );

export type AddProject = z.infer<typeof AddProjectSchema>;

export const UpdateProjectSchema = z
    .object({
        title: z
            .string({
                invalid_type_error: 'Field should be of type string.',
            })
            .min(3, 'Min. 3 characters')
            .max(20, 'Max 20 characters')
            .optional(),
        start_date: z.coerce
            .date({
                invalid_type_error: 'Field should be formatted as a valid date',
            })
            .optional(),
        due_date: z.coerce
            .date({
                invalid_type_error: 'Field should be formatted as a valid date',
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
    })

    .superRefine((val, ctx) => {
        if (!val.start_date && !val.due_date) return;
        if (!val.start_date || !val.due_date) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    'Both start date and due date must be present at the same time when updating either of them.',
                fatal: true,
            });
            return z.NEVER;
        }
        return dayjs(val.due_date).diff(val.start_date) >= 0
            ? true
            : ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Due date cannot be before start date.',
              });
    });

export const InviteUserSchema = z.object({
    username: z.string({
        required_error: 'userId is required.',
        invalid_type_error: 'userId should be of type string.',
    }),
});

export type InviteUser = z.infer<typeof InviteUserSchema>;

export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
