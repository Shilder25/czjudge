import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Key, Sparkles } from "lucide-react";

export default function ApiKeyInfo() {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-xl">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
          <Key className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2 font-[Space_Grotesk]">
              Cómo Obtener tus API Keys
            </h3>
            <p className="text-sm text-muted-foreground">
              Para que Max funcione con IA, necesitas una clave de API de OpenAI o Anthropic. Aquí te explicamos cómo obtenerlas:
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Opción 1: OpenAI (Recomendado)</h4>
              </div>
              <ol className="text-sm text-muted-foreground space-y-2 ml-6 list-decimal">
                <li>Ve a <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com</a></li>
                <li>Crea una cuenta o inicia sesión</li>
                <li>Ve a "API Keys" en tu perfil</li>
                <li>Haz clic en "Create new secret key"</li>
                <li>Copia la clave (empieza con "sk-...")</li>
                <li>Guárdala como variable de entorno <code className="bg-primary/10 px-2 py-0.5 rounded text-primary font-mono text-xs">OPENAI_API_KEY</code></li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-2 hover-elevate"
                onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
              >
                Ir a OpenAI
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Opción 2: Anthropic (Claude)</h4>
              </div>
              <ol className="text-sm text-muted-foreground space-y-2 ml-6 list-decimal">
                <li>Ve a <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">console.anthropic.com</a></li>
                <li>Crea una cuenta o inicia sesión</li>
                <li>Ve a "API Keys" en la configuración</li>
                <li>Genera una nueva API key</li>
                <li>Copia la clave</li>
                <li>Guárdala como variable de entorno <code className="bg-primary/10 px-2 py-0.5 rounded text-primary font-mono text-xs">ANTHROPIC_API_KEY</code></li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-2 hover-elevate"
                onClick={() => window.open('https://console.anthropic.com', '_blank')}
              >
                Ir a Anthropic
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-xs text-foreground">
              <strong>💡 Consejo:</strong> En Replit, puedes agregar estas claves en la pestaña "Secrets" 
              del panel izquierdo. Así estarán seguras y no se compartirán públicamente.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
