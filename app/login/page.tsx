import LoginButton from '@/components/LoginButton';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6">
      <h1 className="text-2xl font-bold">Welcome to NEUROGEN</h1>
      <p className="text-gray-600">Sign in to reflect, evolve, and shift your state.</p>
      <LoginButton />
    </div>
  );
}
