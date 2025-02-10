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

  const { mutate: deleteUser, isPending } = useMutation({
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
        variant="destructive"
        className="self-start"
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Trash2 size={18} />
        Delete Account
      </Button>

      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title="Delete your Account?"
        description="This action cannot be undone. You will immediately be logged out."
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <section className="space-y-3">
            <div>
              <Input
                placeholder={userName}
                aria-label="Confirm deletion of portfolio"
                className="text-base"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                }}
              />
              <p className="text-desc pointer-events-none p-1 text-sm">
                Enter &apos;{userName}&apos; to delete your account.
              </p>
            </div>
            <div>
              <Input
                placeholder="CONFIRM"
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <p className="text-desc pointer-events-none p-1 text-sm">
                Enter &apos;CONFIRM&apos; to delete your account.
              </p>
            </div>
          </section>

          <DialogButtons
            isPending={isPending}
            setOpen={setOpen}
            buttonText="I am sure, delete"
            buttonLoadingText="Deleting"
            buttonDisabled={input !== 'CONFIRM' || nameInput !== userName}
          />
        </form>
      </ResponsiveDialog>
    </>
  );
};
