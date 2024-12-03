import { Route, Routes } from "react-router";
import { AuthLayout, LoginCard, RegisterCard } from "./components/auth";
import { ModeToggle } from "./components/mode-toggle";

export default function App() {
  return (
    <div>
      <ModeToggle />
      <h1 className="text-4xl font-bold text-center dark:text-red-800 text-blue-500">
        Hello, world!
      </h1>
    </div>
  );
}

function About() {
  return <h1>About</h1>;
}

export function MuseRouting() {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="about" element={<About />} />

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginCard />} />
        <Route path="register" element={<RegisterCard />} />
      </Route>
    </Routes>
  );
}
