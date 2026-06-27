'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { ModalSwitchRow } from '@/components/common/ModalSwitchRow';
import { ProfileInputField, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { useCreateRoleMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { createRoleSchema, type CreateRoleFormData } from '@/features/roles/roleSchemas';

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateRoleDialog({ open, onClose }: CreateRoleDialogProps) {
  const [createRole, { isLoading }] = useCreateRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: '', description: '', status: 'active' },
  });

  const status = watch('status');

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateRoleFormData) => {
    try {
      await createRole({
        name: data.name,
        description: data.description || '',
        status: data.status,
      }).unwrap();
      toast.success('Role created successfully');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Create role"
      description="Add a new role for assigning permissions to users."
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-role-form"
          submitLabel="Create role"
          loading={isLoading}
        />
      }
    >
      <form id="create-role-form" onSubmit={handleSubmit(onSubmit)} className={modalFormClass}>
        <ProfileInputField
          id="role-name"
          label="Role name"
          placeholder="e.g. Content Manager"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <ProfileTextareaField
          id="role-description"
          label="Description (optional)"
          placeholder="What can users with this role do?"
          error={errors.description?.message}
          {...register('description')}
        />

        <ModalSwitchRow
          label="Active status"
          description="Inactive roles cannot be assigned to new users."
          checked={status === 'active'}
          onCheckedChange={(checked) => setValue('status', checked ? 'active' : 'inactive')}
          ariaLabel="Role active status"
        />
      </form>
    </AppModal>
  );
}
