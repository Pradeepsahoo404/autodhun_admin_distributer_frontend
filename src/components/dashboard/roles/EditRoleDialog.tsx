'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { ProfileField, ProfileInputField, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { useUpdateRoleMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { editRoleSchema, type EditRoleFormData } from '@/features/roles/roleSchemas';
import type { Role } from '@/types';

interface EditRoleDialogProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
}

export function EditRoleDialog({ open, role, onClose }: EditRoleDialogProps) {
  const [updateRole, { isLoading }] = useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema),
  });

  useEffect(() => {
    if (!role) return;
    reset({ name: role.name, description: role.description ?? '' });
  }, [role, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: EditRoleFormData) => {
    if (!role) return;
    try {
      await updateRole({
        id: role._id,
        body: role.isSystem
          ? { description: data.description || '' }
          : { name: data.name, description: data.description || '' },
      }).unwrap();
      toast.success('Role updated successfully');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const isSystemRole = Boolean(role?.isSystem);

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit role"
      description={
        role
          ? isSystemRole
            ? `Update description for ${role.slug} (system role)`
            : `Update details for ${role.slug}`
          : undefined
      }
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-role-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!role}
        />
      }
    >
      <form id="edit-role-form" onSubmit={handleSubmit(onSubmit)} className={modalFormClass}>
        <ProfileInputField
          id="edit-role-name"
          label="Role name"
          disabled={isSystemRole}
          error={errors.name?.message}
          {...register('name')}
        />

        <ProfileTextareaField
          id="edit-role-description"
          label="Description"
          error={errors.description?.message}
          {...register('description')}
        />

        <ProfileField label="Slug" value={role?.slug} />
      </form>
    </AppModal>
  );
}
