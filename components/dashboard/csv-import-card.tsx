"use client";

import { useRef, useState } from "react";
import { Upload, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ImportMessage {
  type: "success" | "error" | "info";
  title: string;
  text: string;
  details?: string[];
}

export function CsvImportCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<ImportMessage | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica
    if (!file.name.endsWith(".csv")) {
      setMessage({
        type: "error",
        title: "Arquivo inválido",
        text: "Por favor, selecione um arquivo .csv",
      });
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/import-csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          title: "Sucesso!",
          text: `${data.tasksCount} tarefa(s) importada(s) com sucesso`,
          details: [
            `Importado em: ${new Date(data.importedAt).toLocaleString("pt-BR")}`,
            "O dashboard será atualizado em breve...",
          ],
        });

        // Limpar input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Recarregar página após 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({
          type: "error",
          title: "Erro na importação",
          text: data.error || "Erro desconhecido",
          details: data.errors || (data.details ? [data.details] : undefined),
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        title: "Erro de conexão",
        text: "Não foi possível conectar ao servidor",
        details: [String(error)],
      });
    } finally {
      setLoading(false);
    }
  }

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Importar Dados do Kanboard</h3>
        <span className="text-xs text-slate-500">CSV</span>
      </div>

      {/* Descrição */}
      <p className="text-sm text-slate-600">
        Exporte um arquivo CSV do Kanboard e faça upload aqui para atualizar o dashboard com os dados reais.
      </p>

      {/* Upload Area */}
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            disabled={loading}
            className="hidden"
            aria-label="Selecionar arquivo CSV"
          />

          <button
            onClick={handleButtonClick}
            disabled={loading}
            className="w-full gap-2 flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {fileName ? `Arquivo: ${fileName}` : "Selecionar CSV"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`space-y-2 rounded-lg border p-3 ${
            message.type === "success"
              ? "border-green-200 bg-green-50"
              : message.type === "error"
                ? "border-red-200 bg-red-50"
                : "border-blue-200 bg-blue-50"
          }`}
        >
          <div className="flex items-start gap-3">
            {message.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            )}

            <div className="flex-1">
              <h4
                className={`font-semibold ${
                  message.type === "success" ? "text-green-900" : "text-red-900"
                }`}
              >
                {message.title}
              </h4>
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {message.text}
              </p>

              {message.details && message.details.length > 0 && (
                <ul
                  className={`mt-2 space-y-1 text-xs ${
                    message.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dica */}
      <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
        <p className="font-semibold">💡 Como usar:</p>
        <ol className="mt-2 ml-4 list-decimal space-y-1">
          <li>Abra o Kanboard: https://board.cefor.ifes.edu.br</li>
          <li>Clique em &quot;Export&quot; → &quot;Download as CSV&quot;</li>
          <li>Selecione o arquivo aqui</li>
          <li>Dashboard se atualizará automaticamente</li>
        </ol>
      </div>
    </div>
  );
}
