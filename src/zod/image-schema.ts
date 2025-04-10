import { z } from "zod";

const imageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  file: z.union([
    z.instanceof(File, { message: "Image file is required" })
      .superRefine((file, ctx) => {
        if (!file.type.startsWith("image/")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select an image file",
          })
        }
        if (file.size > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Image size should be less than 5MB",
          })
        }
      }),
    z.string().url().optional(), // Allow URL (image URL) in edit mode
  ]).optional(),
}).refine(data => data.file || data.file === "", {
  message: "Image file is required",
  path: ["file"]
});

export default imageSchema;