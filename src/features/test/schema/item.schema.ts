import { z } from 'zod';

const ItemLegacyItemPropertiesSchema = z.record(z.string(), z.any()).optional();

const ItemLegacySchema = z.object({
  itemType: z.string().optional(),
  itemProperties: ItemLegacyItemPropertiesSchema,
  viewProperties: z
    .object({
      backgroundColor: z.string().optional(),
      dimensions: z.tuple([z.number(), z.number()]).optional(),
      scrollable: z.boolean().optional(),
      variables: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

const ItemPropertiesSchema = z.object({
  frame: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
});

const ItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  properties: ItemPropertiesSchema,
  content: z.array(z.string()),
  legacy: ItemLegacySchema.optional(),
  currentState: z
    .object({
      selected: z.boolean(),
      frame: z
        .object({
          x: z.number(),
          y: z.number(),
          width: z.number(),
          height: z.number(),
        })
        .optional(),
      itemSpring: z.any().optional(),
    })
    .optional(),
});

const ItemRequestSchema = z.object({
  data: z.record(z.string(), z.unknown()),
  id: z.string(),
  instance: z.string(),
  properties: ItemLegacyItemPropertiesSchema,
});

export type ItemLegacyItemProperties = z.infer<
  typeof ItemLegacyItemPropertiesSchema
>;

export type ItemLegacy = z.infer<typeof ItemLegacySchema>;

export type ItemProperties = z.infer<typeof ItemPropertiesSchema>;

export type Item = z.infer<typeof ItemSchema>;

export type ItemCollection = Record<Item['id'], Item>;

export type ItemRequest = z.infer<typeof ItemRequestSchema>;
