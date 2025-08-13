import ClientOnly from '@/components/ClientOnly';
import RitualForm from '@/components/RitualForm';

export default function Home() {
  return (
    <div className="space-y-8">
      <ClientOnly>
        <RitualForm />
      </ClientOnly>
    </div>
  );
}
