
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground">BASE Exchange</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Sistema de Gerenciamento de Ordens
          </h2>
          <p className="text-xl text-muted-foreground">
            Gerencie suas ordens de forma eficiente e segura. Visualize, crie e cancele ordens com facilidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Visualização de Ordens</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Tabelas com colunas completas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Filtros por ID, instrumento, status e mais</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Ordenação e detalhes completos</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Gerenciamento</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Criação de ordens com validação</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Cancelamento com confirmação</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Lógica de execução automática</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate("/orders")}
          >
            Acessar Gerenciamento de Ordens
          </Button>
        </div>
      </main>

      <footer className="bg-muted py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>BASE Exchange &copy; {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
