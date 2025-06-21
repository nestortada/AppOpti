import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-3xl font-bold">404 - No encontrado</h1>
      <Link to="/" className="text-blue-600 underline">Volver al inicio</Link>
    </div>
  );
}
