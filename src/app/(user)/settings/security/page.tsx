import { Separator } from '@/components/ui/separator';
import { TwoFactorModal } from '@/features/auth/two-factor-modal';

export default function SettingsSecuritysPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl">Security Settings</h1>
        <p className="text-desc text-sm">
          Manage and administer your security settings
        </p>
        <Separator className="mt-2" />
      </div>
      <TwoFactorModal />
    </div>
  );
}
