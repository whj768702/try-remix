import type { ActionFunction } from 'remix';
import { redirect } from 'remix';
import { db } from '~/utils/db.server';

export let action: ActionFunction = async ({ request }) => {
  let form = await request.formData();
  let name = form.get('name');
  let content = form.get('content');

  if (typeof name !== 'string' || typeof content !== 'string') {
    throw new Error(`Form not submitted correctly`);
  }

  let fields = { name, content };
  let joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content"></textarea>
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
