import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';
import { marked } from 'marked';

export type Post = {
  slug: string;
  title: string;
}
export type PostMarkdownAttributes = {
  title: string;
}
function isValidPostAttributes(attributes: any): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

const postsPath = path.join(__dirname, '..', 'posts');

export async function getPosts() {
  let dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async filename => {
      let file = await fs.readFile(
        path.join(postsPath, filename)
      );
      let { attributes } = parseFrontMatter(
        file.toString()
      );
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title
      };
    })
  );
}
export async function getPost(slug: string) {
  let filePath = path.join(postsPath, slug + '.md');
  const file = await fs.readFile(filePath);
  let { attributes, body } = parseFrontMatter(file.toString());
  invariant(isValidPostAttributes(attributes), `Post ${filePath} is missing attributes`);

  let html = marked(body);
  return {
    slug,
    html,
    title: attributes.title
  }
}