import type { ActionFunction, LinksFunction } from 'remix';
import { useActionData, Link, useSearchParams } from 'remix';
import stylesUrl from '../styles/login.css';
import { db } from '~/utils/db.server';
import { login } from '~/utils/session.server';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

function validateUsername(username: string) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Username must be at least 3 characters long`;
  }
}

function validatePassword(password: string) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

export let action: ActionFunction = async ({ request }): Promise<Response | ActionData> => {
  let form = await request.formData();
  let loginType = form.get('loginType');
  let username = form.get('username');
  let password = form.get('password');
  let redirectTo = form.get('redirectTo');
  if (
    typeof loginType !== 'string' ||
    typeof password !== 'string' ||
    typeof username !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return { formError: 'Form not submitted correctly.' };
  }

  let fields = { loginType, username, password };
  let fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields };
  }

  switch (loginType) {
    case 'login': {
      let user = await login({ username, password });
      console.log(user);
      if (!user) {
        return { fields, formError: 'username/password combination is incorrect.' };
      }
      return { fields, formError: 'Not implemented' };
    }
    case 'register': {
      let userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return { fields, formError: `User with username ${username} already exists` };
      }
      return { fields, formError: 'not implemented' };
    }
    default: {
      return { fields, formError: 'Login type invalid' };
    }
  }
};

export default function Login() {
  let actionData = useActionData<ActionData | undefined>();
  let [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form method="post" aria-describedby={actionData?.formError ? 'form-error-message' : undefined}>
          <input type="hidden" name="redirectTo" value={searchParams.get('redirectTo') ?? undefined} />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={!actionData?.fields?.loginType || actionData?.fields?.loginType === 'login'}
              />{' '}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />{' '}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fields?.username)}
            />
            {actionData?.fieldErrors?.username ? (
              <p className="form-validation-error" role="alert" id="username-error">
                {actionData?.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              type="password"
              id="password-input"
              name="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
              aria-describedby={actionData?.fields?.password ? 'password-error' : undefined}
            />
            {actionData?.fieldErrors?.password ? (
              <p className="form-validation-error" role="alert" id="password-error">
                {actionData?.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>
          <button className="button" type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}