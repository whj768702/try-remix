export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            name: <input type="text" name="name"/>
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content"></textarea>
          </label>
        </div>
        <div>
          <button type="submit" className="button">Add</button>
        </div>
      </form>
    </div>
  );
}