document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('unbanForm');
  const fields = {
    name: document.getElementById('name'),
    banNumber: document.getElementById('banNumber'),
    country: document.getElementById('country'),
    deviceType: document.getElementById('deviceType'),
    contactNumber: document.getElementById('contactNumber'),
    paymentMethod: document.getElementById('paymentMethod'),
    paymentScreenshot: document.getElementById('paymentScreenshot')
  };
  
  const ERR = {
    name: document.getElementById('err-name'),
    banNumber: document.getElementById('err-banNumber'),
    country: document.getElementById('err-country'),
    deviceType: document.getElementById('err-deviceType'),
    contactNumber: document.getElementById('err-contactNumber'),
    paymentMethod: document.getElementById('err-paymentMethod'),
    paymentScreenshot: document.getElementById('err-paymentScreenshot')
  };
  
  const preview = document.getElementById('preview');
  const uploadBtn = document.getElementById('uploadBtn');
  const clearBtn = document.getElementById('clearBtn');
  const MAX_MB = 10;
  const MAX_BYTES = MAX_MB * 1024 * 1024;
  
  // Clear all errors and borders
  function clearErrors() {
    Object.values(ERR).forEach(e => e.textContent = '');
    document.querySelectorAll('.error-card').forEach(c => c.style.border = '');
  }
  
  // File preview
  function showPreview(file) {
    preview.innerHTML = '';
    if (!file) return;
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.onload = () => URL.revokeObjectURL(img.src);
      thumb.appendChild(img);
    } else {
      const box = document.createElement('div');
      box.textContent = 'FILE';
      box.style.width = '64px';
      box.style.height = '64px';
      box.style.display = 'flex';
      box.style.alignItems = 'center';
      box.style.justifyContent = 'center';
      box.style.border = '1px solid red';
      box.style.borderRadius = '6px';
      thumb.appendChild(box);
    }
    
    const info = document.createElement('div');
    info.innerHTML = `
      <div style="font-weight:600; font-size:0.8em;">${file.name}</div>
      <div style="font-size:0.7em; color:#666;">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
    `;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn ghost';
    removeBtn.onclick = () => {
      fields.paymentScreenshot.value = '';
      preview.innerHTML = '';
      ERR.paymentScreenshot.textContent = '';
    };
    
    thumb.appendChild(info);
    thumb.appendChild(removeBtn);
    preview.appendChild(thumb);
  }
  
  // Upload button triggers hidden file input
  uploadBtn.addEventListener('click', e => {
    e.preventDefault();
    fields.paymentScreenshot.click();
  });
  
  fields.paymentScreenshot.addEventListener('change', e => {
    const file = e.target.files[0];
    ERR.paymentScreenshot.textContent = '';
    if (!file) { preview.innerHTML = ''; return; }
    
    if (file.size > MAX_BYTES) {
      ERR.paymentScreenshot.textContent = `File too big. Max ${MAX_MB} MB allowed.`;
      fields.paymentScreenshot.value = '';
      preview.innerHTML = '';
      return;
    }
    
    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
      ERR.paymentScreenshot.textContent = 'Only image or PDF allowed.';
      fields.paymentScreenshot.value = '';
      preview.innerHTML = '';
      return;
    }
    
    showPreview(file);
  });
  
  clearBtn.addEventListener('click', () => {
    if (confirm('You sure want to clear this form?')) {
      form.reset();
      preview.innerHTML = '';
      clearErrors();
    }
  });
  
  // Clear all errors, borders, and input-error class
  function clearErrors() {
    Object.values(ERR).forEach(e => e.textContent = '');
    document.querySelectorAll('.error-card').forEach(c => c.style.border = '');
    document.querySelectorAll('.input-error').forEach(f => f.classList.remove('input-error')); // ✅ remove danger class
  }
  
  // Form validation
  function validate() {
    clearErrors();
    let ok = true;
    let firstInvalid = null;
    
    for (const key in fields) {
      const field = fields[key];
      const err = ERR[key];
      const parentCard = field.closest('.error-card');
      
      if (key !== 'paymentScreenshot') {
        if (!field.value.trim()) {
          err.innerHTML = `<span class="circle-exclam">!</span> This field is required`;
          if (parentCard) parentCard.style.border = '1px solid var(--danger)';
          field.classList.add('input-error'); // <-- Add this
          ok = false;
          if (!firstInvalid) firstInvalid = field;
        } else {
          field.classList.remove('input-error'); // <-- Remove if valid
        }
      } else {
        const file = field.files[0];
        if (!file || file.size > MAX_BYTES) {
          err.innerHTML = `<span class="circle-exclam">!</span> Upload payment screenshot`;
          if (parentCard) parentCard.style.border = '1px solid var(--danger)';
          ok = false;
          if (!firstInvalid) firstInvalid = field;
          field.classList.add('input-error'); // <-- Add
        } else {
          field.classList.remove('input-error'); // <-- Remove if valid
        }
      }
    }
    
    // Scroll & focus first invalid field
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.focus();
    }
    
    return ok;
  }
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    
    const file = fields.paymentScreenshot.files[0];
    const data = {
      name: fields.name.value.trim(),
      banNumber: fields.banNumber.value.trim(),
      country: fields.country.value,
      deviceType: fields.deviceType.value.trim(),
      contactNumber: fields.contactNumber.value.trim(),
      paymentMethod: fields.paymentMethod.value,
      paymentFileName: file.name
    };
    
    console.log('Form data:', data);
    
    // Redirect after submission
    if (confirm('You sure want to submit?')) {
      window.location.href = 'submit.html';
    }
  });
});