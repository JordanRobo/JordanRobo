const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const README_PATH = path.join(__dirname, '..', '..', 'README.md');
const BLOG_POST_LIST_MARKER_START = '<!-- BLOG-POST-LIST:START -->';
const BLOG_POST_LIST_MARKER_END = '<!-- BLOG-POST-LIST:END -->';

async function main() {
  try {
    // Fetch blog posts
    const response = await axios.get('https://jordanrobo.xyz/api/posts');
    const posts = response.data.slice(0, 3); // Get the 3 most recent posts

    // Read the current README
    let readmeContent = await fs.readFile(README_PATH, 'utf8');

    // Generate the new blog post list
    const blogPostList = posts.map(post => `- [${post.title}](https://jordanrobo.xyz/posts/${post.slug})`).join('\n');

    // Replace the existing blog post list
    const newReadmeContent = readmeContent.replace(
      new RegExp(`${BLOG_POST_LIST_MARKER_START}[\\s\\S]*${BLOG_POST_LIST_MARKER_END}`),
      `${BLOG_POST_LIST_MARKER_START}\n${blogPostList}\n${BLOG_POST_LIST_MARKER_END}`
    );

    // Write the updated content back to the README
    await fs.writeFile(README_PATH, newReadmeContent);

    console.log('README updated successfully');
  } catch (error) {
    console.error('Error updating README:', error);
    process.exit(1);
  }
}

main();
