function showModal({ message, buttons }) {
  const modal = document.getElementById('modal');
  const messageBox = document.getElementById('modal-message');
  const buttonBox = document.getElementById('modal-buttons');

  messageBox.textContent = message;
  buttonBox.innerHTML = ''; // clear previous buttons

  buttons.forEach(({ label, action, variant = 'gray' }) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = `px-4 py-2 rounded text-sm bg-${variant}-500 hover:bg-${variant}-600 text-white`;
    btn.onclick = () => {
      modal.classList.add('hidden');
      action?.();
    };
    buttonBox.appendChild(btn);
  });

  modal.classList.remove('hidden');
}

function confirmModal(message) {
  return new Promise((resolve) => {
    showModal({
      message,
      buttons: [
        { label: 'Cancel', action: () => resolve(false), variant: 'gray' },
        { label: 'Confirm', action: () => resolve(true), variant: 'blue' },
      ],
    });
  });
}

function showToast(message, duration = 3000) {
  let container = document.getElementById('toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-4 right-4 space-y-2 z-50';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className =
    'bg-blue-500 text-white px-4 py-2 rounded shadow transition-opacity duration-300 opacity-0';
  toast.textContent = message;
  container.appendChild(toast);

  // Ensure transition kicks in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('opacity-100');
    });
  });

  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.addEventListener(
      'transitionend',
      () => toast.remove(),
      {
        once: true,
      },
      duration
    );
  });
}
