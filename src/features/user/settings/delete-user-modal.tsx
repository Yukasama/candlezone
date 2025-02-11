'use client';

import { DialogButtons } from '@/components/dialog-buttons';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteUser as deleteUserFn } from '../actions/delete-user';

interface Props {
  userName: string;
}

export const DeleteUserModal = ({ userName }: Props) => {
  const [input, setInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [open, setOpen] = useState(false);

  const { isPending, mutate: deleteUser } = useMutation({
    mutationFn: deleteUserFn,
    onError: () => toast.error('Account could not be deleted.'),
    onSuccess: async () => {
      await signOut();
    },
  });

  const onSubmit = () => {
    if (input !== 'CONFIRM') {
      toast.warning("Please enter 'CONFIRM' to delete your account.");
      return;
    }
    deleteUser();
    setOpen(false);
  };

  return (
    <>
      <Button
        className="self-start"
        onClick={() => setOpen(true)}
        size="sm"
        variant="destructive"
      >
        <Trash2 size={18} />
        Delete Account
      </Button>

      <ResponsiveDialog
        description="This action cannot be undone. You will immediately be logged out."
        open={open}
        setOpen={setOpen}
        title="Delete your Account?"
      >
        <form className="space-y-6" onSubmit={onSubmit}>
          <section className="space-y-3">
            <div>
              <Input
                aria-label="Confirm deletion of portfolio"
                className="text-base"
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={userName}
                value={nameInput}
              />
              <p className="text-desc pointer-events-none p-1 text-sm">
                Enter &apos;{userName}&apos; to delete your account.
              </p>
            </div>
            <div>
              <Input
                onChange={(e) => setInput(e.target.value)}
                placeholder="CONFIRM"
              />
              <p className="text-desc pointer-events-none p-1 text-sm">
                Enter &apos;CONFIRM&apos; to delete your account.
              </p>
            </div>
          </section>

          <DialogButtons
            buttonDisabled={input !== 'CONFIRM' || nameInput !== userName}
            buttonLoadingText="Deleting"
            buttonText="I am sure, delete"
            isPending={isPending}
            setOpen={setOpen}
          />
        </form>
      </ResponsiveDialog>
    </>
  );
};
