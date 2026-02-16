import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página no encontrada</h2>
        <p className="not-found-message">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <Link to="/" className="not-found-button">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
