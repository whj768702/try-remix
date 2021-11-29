import { useLoaderData, Form } from 'remix';
import type { LoaderFunction } from 'remix';
import {getPost} from '~/post'
import invariant from 'tiny-invariant';

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  return getPost(params.slug);
}

export default function EditPost() {
  let post = useLoaderData();
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          <input value={post.title} type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post slug:{" "}
          <input value={post.slug} type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown</label>{" "}
        <br />
        <textarea value={post.html} name="markdown"  rows={ 20 }></textarea>
      </p>
      <p>
        <button type="submit">
          "Create post"
        </button>
      </p>
    </Form>
  );
}