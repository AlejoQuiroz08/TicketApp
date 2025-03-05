import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('login'); // login or register
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, action }),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      router.push('/');
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{action === 'login' ? 'Login' : 'Register'}</button>
      <button type="button" onClick={() => setAction(action === 'login' ? 'register' : 'login')}>
        Switch to {action === 'login' ? 'Register' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
