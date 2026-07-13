// ============================================
// Contact form validation
// Checks: no empty fields, valid email format,
// phone number contains digits only.
// ============================================

(function () {
  var form = document.getElementById('contactForm');
  if (!form) return; // not on the contact page

  var fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    phone: { input: document.getElementById('phone'), error: document.getElementById('phoneError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  var status = document.getElementById('formStatus');
  var sendBtn = document.getElementById('sendMessageBtn');

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phonePattern = /^[0-9]+$/;

  form.addEventListener('submit', function (e) { e.preventDefault(); });

  sendBtn.addEventListener('click', function (e) {
    e.preventDefault();
    handleSend();
  });

  function handleSend() {
    var isValid = true;
    isValid = validateName() && isValid;
    isValid = validateEmail() && isValid;
    isValid = validatePhone() && isValid;
    isValid = validateMessage() && isValid;

    if (isValid) {
      showStatus('Thanks, ' + fields.name.input.value.trim().split(' ')[0] + '! Your message has been received.', 'success');
      form.reset();
    } else {
      showStatus('Please fix the highlighted fields and try again.', 'error');
    }
  }

  // Live validation as the user types, once a field has been touched
  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener('blur', function () {
      validators[key]();
    });
  });

  var validators = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage
  };

  function validateName() {
    var value = fields.name.input.value.trim();
    if (!value) return setError('name', 'Name is required.');
    return setError('name', '');
  }

  function validateEmail() {
    var value = fields.email.input.value.trim();
    if (!value) return setError('email', 'Email address is required.');
    if (!emailPattern.test(value)) return setError('email', 'Enter a valid email address, e.g. name@example.com.');
    return setError('email', '');
  }

  function validatePhone() {
    var value = fields.phone.input.value.trim();
    if (!value) return setError('phone', 'Phone number is required.');
    if (!phonePattern.test(value)) return setError('phone', 'Phone number must contain digits only.');
    return setError('phone', '');
  }

  function validateMessage() {
    var value = fields.message.input.value.trim();
    if (!value) return setError('message', 'Message cannot be empty.');
    return setError('message', '');
  }

  function setError(key, message) {
    fields[key].error.textContent = message;
    fields[key].input.classList.toggle('invalid', Boolean(message));
    return !message;
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'form-status show ' + type;
  }
})();
