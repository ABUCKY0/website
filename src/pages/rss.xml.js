import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';

export async function GET(context) {
  const postImportResult = import.meta.glob('./posts/content/*.md', { eager: true });
  const posts = Object.values(postImportResult);
  return rss({
    title: "Aaron's Blog",
    description: 'A collection of my thoughts, projects, and experiences.',
    site: context.site,
    items: await Promise.all(posts.map(async (post) => {
      // Remove '/content' from the post URL if present
      let link = post.url.replace('/content', '');
      return {
        link,
        content: sanitizeHtml((await post.compiledContent())),
        ...post.frontmatter,
      };
    })),
  });
}