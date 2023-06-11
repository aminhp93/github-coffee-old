import { z } from "zod";

const ViewItemSchema = z.object({
	instance: z.string(),
	id: z.string(),
	properties: z.record(z.string(), z.any()),
});

export const ViewSchema = z.object({
	id: z.string(),
	backgroundColor: z.string().optional(),
	canEdit: z.boolean(),
	context: z.record(z.string(), z.unknown()).catch({}).optional(),
	dimensions: z.tuple([z.number(), z.number()]).optional(),
	items: z.array(ViewItemSchema),
	scrollable: z.boolean().optional(),
	template: z.unknown().optional(),
	resourcePath: z.string(),
});

export type View = z.infer<typeof ViewSchema>;
