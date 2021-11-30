import { useCatch, LiveReload, Outlet, LinksFunction, Links, MetaFunction, Meta } from 'remix';
import globalStyleUrl from './styles/global.css';
import globalMediumStyleUrl from './styles/global-medium.css';
import globalLargeStyleUrl from './styles/global-large.css';

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyleUrl },
    { rel: 'stylesheet', href: globalMediumStyleUrl, media: 'print, (min-width:640px)' },
    { rel: 'stylesheet', href: globalLargeStyleUrl, media: 'screen and (min-width: 1024px)' },
  ];
};

export let meta: MetaFunction = () => {
  let description = `Learn Remix and laugh at the same time`;
  return {
    description,
    keywords: 'Remix,jokes',
    'twitter:image': 'https://remix-jokes.lol/social.png',
    'twitter:card': 'summary_large_image',
    'twitter:creator': '@remix_run',
    'twitter:size': '@remix_run',
    'twitter:title': 'Remix Jokes',
    'twitter:description': description,
  };
};

function Document({ children, title = `Remix: So great, it's funny!` }: { children: React.ReactNode; title?: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta></Meta>
        <title>Remix: So great, it's funny!'</title>
        <Links></Links>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet></Outlet>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
