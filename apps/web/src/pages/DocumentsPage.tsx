import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Trash2, Zap, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { documentsService } from '../services/documentsService';
import { formatDate, formatFileSize, DOCUMENT_TYPES } from '@legal-ai/shared';
import type { Document, DocumentAnalysis } from '@legal-ai/shared';

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<DocumentAnalysis | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await documentsService.list();
      setDocuments(docs);
    } catch {
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!acceptedFiles[0]) return;
    setUploading(true);
    try {
      const doc = await documentsService.upload(acceptedFiles[0], {
        title: acceptedFiles[0].name.replace(/\.[^.]+$/, ''),
        type: 'OTHER',
      });
      setDocuments((prev) => [doc, ...prev]);
      setShowUploadModal(false);
      toast.success('Documento enviado com sucesso!');
    } catch {
      toast.error('Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (doc: Document) => {
    setAnalyzing(doc.id);
    try {
      const analysis = await documentsService.analyze(doc.id);
      setSelectedAnalysis(analysis);
      setDocuments((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: 'ANALYZED' } : d))
      );
      toast.success('Análise concluída!');
    } catch {
      toast.error('Erro ao analisar documento. Verifique a configuração da OpenAI API.');
      setDocuments((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: 'ERROR' } : d))
      );
    } finally {
      setAnalyzing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirmar exclusão do documento?')) return;
    try {
      await documentsService.delete(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success('Documento excluído');
    } catch {
      toast.error('Erro ao excluir documento');
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'ANALYZING': return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'ANALYZED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-500">Analise contratos, petições e documentos jurídicos com IA</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Enviar Documento
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="card text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum documento</h3>
          <p className="text-gray-500 mt-1">Envie seu primeiro documento para análise</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Enviar Documento
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                {statusIcon(doc.status)}
                <div>
                  <p className="font-medium text-gray-900">{doc.title}</p>
                  <p className="text-sm text-gray-400">
                    {DOCUMENT_TYPES[doc.type as keyof typeof DOCUMENT_TYPES]} •{' '}
                    {formatFileSize(doc.fileSize)} • {formatDate(doc.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAnalyze(doc)}
                  disabled={analyzing === doc.id || doc.status === 'ANALYZING'}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  {analyzing === doc.id ? 'Analisando...' : 'Analisar com IA'}
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowUploadModal(false)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Enviar Documento</h3>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              {acceptedFiles[0] ? (
                <p className="text-sm font-medium text-green-600">{acceptedFiles[0].name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">Arraste um arquivo aqui</p>
                  <p className="text-xs text-gray-400 mt-1">PDF ou DOCX, máximo 10MB</p>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={!acceptedFiles[0] || uploading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {uploading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedAnalysis(null)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Resultado da Análise</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Resumo</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAnalysis.summary}</p>
              </div>

              {selectedAnalysis.keyPoints.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Pontos-chave</h4>
                  <ul className="space-y-1">
                    {selectedAnalysis.keyPoints.map((p, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-blue-500 font-bold">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAnalysis.risks.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Riscos Identificados</h4>
                  {selectedAnalysis.risks.map((r, i) => (
                    <div
                      key={i}
                      className={`text-sm p-2 rounded mb-1 ${
                        r.severity === 'HIGH' ? 'bg-red-50 text-red-700' :
                        r.severity === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}
                    >
                      <span className="font-medium">[{r.severity}]</span> {r.description}
                    </div>
                  ))}
                </div>
              )}

              {selectedAnalysis.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Sugestões</h4>
                  <ul className="space-y-1">
                    {selectedAnalysis.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-green-500 font-bold">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAnalysis(null)}
              className="mt-4 btn-primary w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
