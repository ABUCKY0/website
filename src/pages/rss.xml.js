import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';

export async function GET(context) {
  const postImportResult = import.meta.glob('./posts/content/*.md', { eager: true });
  const posts = Object.values(postImportResult);
  return rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    site: context.site,
    items: await Promise.all(posts.map(async (post) => ({
      link: post.url,
      content: sanitizeHtml((await post.compiledContent())),
      ...post.frontmatter,
    }))),
  });
}