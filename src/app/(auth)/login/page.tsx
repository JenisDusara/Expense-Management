'use client';

import { LoginForm } from '@/components/auth-components';
import AuthLayout from '../layout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
