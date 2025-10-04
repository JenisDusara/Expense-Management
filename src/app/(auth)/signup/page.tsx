'use client';

import { SignUpForm } from '@/components/auth-components';
import AuthLayout from '../layout';

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
