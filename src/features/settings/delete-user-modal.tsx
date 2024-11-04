'use client';

import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteUser as deleteUserFn } from '../user/actions/delete-user';

export const DeleteUserModal = () => {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: deleteUserFn,
    onError: () => toast.error('Account could not be deleted.'),
    onSuccess: () => router.push('/api/auth/logout'),
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="self-start" size="sm">
          <Trash2 size={18} />
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. You will immediately be logged out.
          </DialogDescription>
        </DialogHeader>

        <div className="f-col gap-1.5">
          <Input
            placeholder="CONFIRM"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CardDescription>
            Enter &apos;CONFIRM&apos; to delete your account.
          </CardDescription>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            isLoading={isPending}
            onClick={onSubmit}
          >
            I am sure, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
