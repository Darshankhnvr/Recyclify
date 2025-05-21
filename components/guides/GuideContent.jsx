// components/guides/GuideContent.jsx
"use client"; // If using a Markdown library that requires client-side rendering

import ReactMarkdown from 'react-markdown'; // Popular library for rendering Markdown
import remarkGfm from 'remark-gfm';         // Plugin for GitHub Flavored Markdown (tables, strikethrough, etc.)
// You might need to install these: npm install react-markdown remark-gfm

export default function GuideContent({ content }) {
  if (!content) return null;

  // Basic styling for Markdown elements. You can expand this in your global CSS.
  // Or use Tailwind's typography plugin: @tailwindcss/typography
  const markdownComponents = {
    h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold my-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-semibold my-2" {...props} />,
    p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc list-inside my-4 pl-4 space-y-1" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal list-inside my-4 pl-4 space-y-1" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    a: ({node, ...props}) => <a className="text-green-600 hover:underline" {...props} />,
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700 dark:text-gray-300" {...props} />,
    // Add more custom renderers as needed (e.g., for images, code blocks)
  };

  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none">
      {/* Using prose classes from Tailwind Typography is a great way to style markdown */}
      {/* If not using Tailwind Typography, apply styles via markdownComponents or global CSS */}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}