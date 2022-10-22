import type { MetaFunction } from "@remix-run/node";
import {
  NavLink,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./styles/root.css";
import doodle from "./styles/doodle.css";

export function links() {
  return [
    // tailwind 生成
    { rel: "stylesheet", href: styles },
    // doodle css https://github.com/chr15m/DoodleCSS
    { rel: "stylesheet", href: doodle },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "吃什么",
  description: "吃什么，中午吃什么，晚上吃什么",
  keyword: "吃什么、中午吃什么、晚上吃什么",
  viewport: "width=device-width, initial-scale=1.0",
});

export default function App() {
  const activeStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#333" : "#8e8e93",
  });
  return (
    <html lang="zh-CN">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="doodle">
        <div className="flex h-screen  flex-col	m-[0 auto] items-center pt-[20px]">
          <ul className="shrink-0 flex mb-[20px]">
            <NavLink style={activeStyle} to="help-you-choose">
              <li className="w-[200px]">帮你选择</li>
            </NavLink>
            <NavLink style={activeStyle} to="add-recipe">
              <li className="w-[200px]">添加食谱</li>
            </NavLink>
            <li className="w-[200px]">临时食谱</li>
          </ul>
          <div className="flex">
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
