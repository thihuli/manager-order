
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
        <p className="text-2xl font-semibold mb-6">Página não encontrada</p>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button onClick={() => navigate("/")}>
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
