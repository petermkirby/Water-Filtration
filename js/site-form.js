document.querySelectorAll('form.site-form[data-web3forms]').forEach(function (form) {
  var status = document.createElement('div');
  status.className = 'form-status';
  status.hidden = true;
  form.appendChild(status);

  var button = form.querySelector('button[type="submit"]');
  var buttonDefaultText = button.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = Object.fromEntries(new FormData(form));

    if (data.botcheck) {
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending…';
    status.hidden = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.success) {
          form.reset();
          status.className = 'form-status success';
          status.textContent = form.dataset.successMessage || "Thanks — we've got it and will be in touch soon.";
        } else {
          status.className = 'form-status error';
          status.textContent = 'Something went wrong. Please try again, or email us directly.';
        }
        status.hidden = false;
      })
      .catch(function () {
        status.className = 'form-status error';
        status.textContent = "Something went wrong sending this. Please try again, or email us directly.";
        status.hidden = false;
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = buttonDefaultText;
      });
  });
});
