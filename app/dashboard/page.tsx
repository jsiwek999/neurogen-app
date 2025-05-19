'use client';

import ReflectionForm from '../components/ReflectionForm';
import ReflectionList from '../components/ReflectionList';

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400">
        Your Reflections
      </h1>

      <ReflectionList />

      {/* 👇 onSuccess passed as a no-op function to prevent crash */}
      <ReflectionForm onSuccess={() => {}} />
    </main>
  );
}
