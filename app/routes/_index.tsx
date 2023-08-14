import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { prisma } from "~/utils/db.server.ts";

export const links: LinksFunction = () => [];

export const loader = async () => {
  const user = await prisma.user.findUnique({
    where: {id: 'clla4ipe20000ny6tv2a7w75a'},
    include: { habits: true },
  });
  return json({ user });
};

export default function IndexRoute() {
  const { user } = useLoaderData<typeof loader>();
  
  return (<>
    <div className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto">
        <h1 className="text-xl">Habit Tracker</h1>
      </div>
    </div>

    <div className="container mx-auto mt-6 p-4">
      <h2 className="text-2xl mb-4">My Habits</h2>
      <ul className="space-y-4">
        { user.habits.map(habit => (
          <li className="bg-white p-4 shadow rounded">
            <h3 className="text-lg">{habit.name}</h3>
            <p>{habit.description}</p>
          </li>
        ))}
      </ul>
    </div>
  </>);
}
