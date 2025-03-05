import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

const ProtectedPage = () => {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.role !== 'admin') {
        router.push('/'); // Redirige si el rol no es 'admin'
      } else {
        setRole(decoded?.role);
      }
    } else {
      router.push('/login'); // Redirige si no hay token
    }
  }, []);

  if (!role) return <p>Loading...</p>;

  return <div>Admin Content Here</div>;  // Contenido de la página protegida
};

export default ProtectedPage;
