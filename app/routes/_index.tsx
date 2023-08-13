import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/index.css";
import { prisma } from "~/utils/db.server.ts";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async () => {
  const counts = await prisma.count.findMany();
  console.log('counts: ', counts)
  return null;
};

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1 className="text-3xl font-bold underline">
          Remix <span>Jokes!</span> DEPLOY (Hot)
        </h1>
      </div>
    </div>
  );
}
