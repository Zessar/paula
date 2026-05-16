import { z } from "zod";

export const FAQSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5, "La pregunta debe tener al menos 5 caracteres"),
  answer: z.string().min(5, "La respuesta debe tener al menos 5 caracteres"),
  sort_order: z.number().optional().or(z.string().transform(Number)),
});

export type FAQInput = z.infer<typeof FAQSchema>;
