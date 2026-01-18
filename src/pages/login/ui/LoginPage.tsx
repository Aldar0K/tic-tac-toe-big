import { Navigate, useNavigate } from "react-router-dom";
import { LoginForm } from "@/features/match-setup";
import { getSession, setSession } from "@/features/match-setup/model/session";

export const LoginPage = () => {
  const navigate = useNavigate();
  const session = getSession();

  if (session) {
    return <Navigate to="/game" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
        <LoginForm
          onSubmit={(nextSession) => {
            setSession(nextSession);
            navigate("/game");
          }}
        />
      </div>
    </main>
  );
};
