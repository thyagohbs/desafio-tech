import './ErrorMensagem.css'; // Importando o arquivo de estilos

interface Props {
  mensagem: string | "";
  onRetry?: () => void;
}

const ErrorMensagem = ({ mensagem, onRetry }: Props) => {
  if (!mensagem) return null;

  return (
    <div className="error-message" aria-live="assertive">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p className="error-text">{mensagem}</p>
      </div>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default ErrorMensagem;
