import { Navigate, useNavigate } from "react-router-dom";
import { LoginForm, getSession, setSession } from "@/features/match-setup";
import { Button } from "@/shared/ui";

export const LoginPage = () => {
  const navigate = useNavigate();
  const session = getSession();

  if (session) {
    return <Navigate to="/game" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 px-6 py-12">
        <LoginForm
          onSubmit={(nextSession) => {
            setSession(nextSession);
            navigate("/game");
          }}
        />
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </main>
  );
};
