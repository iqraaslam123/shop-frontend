import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showToast = (icon, title) => {
  Toast.fire({ icon, title });
};

export const showSuccessToast = (title) => showToast('success', title);
export const showErrorToast = (title) => showToast('error', title);
export const showInfoToast = (title) => showToast('info', title);
export const showWarningToast = (title) => showToast('warning', title);

export const showConfirmDialog = async (title, text) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    background: '#1f2937',
    color: '#fff',
  });
  return result.isConfirmed;
};
