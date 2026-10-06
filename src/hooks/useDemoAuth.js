import { useState } from 'react';

export default function useDemoAuth(onSignIn) {
  const [user,setUser] = useState(null);
  const [email,setEmail] = useState('admin@gmail.com');
  const [password,setPassword] = useState('');
  const [loginError,setLoginError] = useState('');
  function login(e) {
    e.preventDefault();
    if (
      !['admin@gmail.com', 'employee@gmail.com'].includes(email) ||
      password !== 'Demo@123'
    ) {
      setLoginError('Use a demo account and password Demo@123.');
      return;
    }
    setUser({
      email,
      role: email.startsWith('admin') ? 'admin' : 'employee',
      dept: 'ERP & IT',
    });
    onSignIn(email.startsWith('admin') ? 'Overview' : 'KPI board');
  }

  return {user,setUser,email,setEmail,password,setPassword,loginError,login};
}
