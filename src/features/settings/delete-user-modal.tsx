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
import { deleteUser as deleteUserFn } from '../user/actions/delete-user';

export const DeleteUserModal = () => {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: deleteUserFn,
    onError: () => toast.error('Account could not be deleted.'),
    onSuccess: async () => {
      await signOut();
    },
  });

  const onSubmit = () => {
    if (title !== 'CONFIRM') {
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
          <section>
            <Input
              placeholder="CONFIRM"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <p className="pointer-events-none p-1 text-sm text-gray-500">
              Enter &apos;CONFIRM&apos; to delete your account.
            </p>
          </section>

          <DialogButtons
            isPending={isPending}
            setOpen={setOpen}
            buttonText="I am sure, delete"
            buttonLoadingText="Deleting"
            buttonDisabled={title !== 'CONFIRM'}
          />
        </form>
      </ResponsiveDialog>
    </>
  );
};
