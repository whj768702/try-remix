import { LiveReload, Outlet } from "remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <title>Remix: So great, it's funny!</title>
      </head>
      <body>
        <Outlet></Outlet>
        {process.env.NODE_ENV === 'development'?(<LiveReload></LiveReload>):null}
      </body>
    </html>
  );
}