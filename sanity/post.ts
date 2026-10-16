/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Blog Post schema for the ORGO FARM website (Sanity CMS).
 *
 * HOW TO USE (in your Sanity Studio project):
 * 1. Save this file as `schemaTypes/post.ts` inside your studio folder.
 * 2. Import + add it to the `types` array in `sanity.config.ts`:
 *      import { post } from "./schemaTypes/post";
 *      schema: { types: [post] },
 * 3. Run `npm run dev` in the studio, open it, write a post and hit Publish.
 * 4. The ORGO FARM website fetches published posts automatically — no code change needed.
 *
 * Field names (title, slug, category, excerpt, mainImage, publishedAt, body)
 * must stay exactly as-is — the website's GROQ queries depend on them.
 *
 * Works with the existing Sanity project:
 *   projectId = 5e8jjc3v
 *   dataset   = production
 */
export const post = {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (rule: any) => rule.required() },
    {
      name: "slug",
      title: "Slug (page address)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule: any) => rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      initialValue: "Skincare Tips",
      placeholder: "e.g. Skincare Tips",
    },
    {
      name: "excerpt",
      title: "Short summary (shows on cards + Google)",
      type: "text",
      rows: 3,
      validation: (rule: any) => rule.required().max(300),
    },
    {
      name: "metaTitle",
      title: "SEO meta title",
      type: "string",
      description:
        "Shown in the browser tab and Google heading. Leave empty to use the normal title. Best within 60 characters.",
      validation: (rule: any) => rule.max(70),
    },
    {
      name: "metaDescription",
      title: "SEO meta description",
      type: "text",
      rows: 2,
      description:
        "Shown under the heading in Google results. Leave empty to use the excerpt. Best within 155 characters.",
      validation: (rule: any) => rule.max(160),
    },
    {
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Type a keyword and press Add.",
      options: { layout: "tags" },
    },
    { name: "mainImage", title: "Cover photo", type: "image", options: { hotspot: true } },
    {
      name: "authorName",
      title: "Writer name",
      type: "string",
      description: "Leave empty to show 'Team ORGO FARM'.",
      placeholder: "Writer's full name",
    },
    { name: "authorRole", title: "Writer role", type: "string", placeholder: "e.g. Skincare Specialist" },
    { name: "authorBio", title: "Writer bio (2-3 lines)", type: "text", rows: 3 },
    { name: "authorImage", title: "Writer photo", type: "image", options: { hotspot: true } },
    {
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule: any) => rule.required(),
    },
    {
      name: "body",
      title: "Article content",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    },
    {
      name: "faqs",
      title: "FAQs (optional — accordion + Google snippet)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string", validation: (rule: any) => rule.required() },
            { name: "answer", title: "Answer", type: "text", rows: 3, validation: (rule: any) => rule.required() },
          ],
        },
      ],
    },
  ],
  preview: { select: { title: "title", subtitle: "category", media: "mainImage" } },
};
