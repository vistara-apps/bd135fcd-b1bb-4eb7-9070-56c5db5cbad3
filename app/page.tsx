import { AppShell } from '../components/layout/AppShell';
import { FeatureGrid } from '../components/features/FeatureGrid';
import { WelcomeHeader } from '../components/layout/WelcomeHeader';

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <WelcomeHeader />
        <FeatureGrid />
      </div>
    </AppShell>
  );
}
