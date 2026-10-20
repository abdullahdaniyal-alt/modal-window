(function () {
  var overlay = document.getElementById("overlay");
  var modal = document.getElementById("modal");
  var openBtn = document.getElementById("openModal");
  var closeBtns = document.querySelectorAll("[data-close]");
  var sendBtn = document.getElementById("sendBtn");
  var fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    message: document.getElementById("message")
  };
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    resetForm();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(function () { fields.name.focus(); }, 80);
  }

  function closeModal() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
  }

  function resetForm() {
    modal.classList.remove("sent");
    Object.keys(fields).forEach(function (k) {
      fields[k].value = "";
      fields[k].parentNode.classList.remove("invalid");
    });
  }

  function validate() {
    var ok = true;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim());
    var checks = {
      name: fields.name.value.trim().length > 0,
      email: emailOk,
      message: fields.message.value.trim().length > 0
    };
    Object.keys(checks).forEach(function (k) {
      fields[k].parentNode.classList.toggle("invalid", !checks[k]);
      if (!checks[k]) ok = false;
    });
    return ok;
  }

  function send() {
    if (!validate()) return;
    modal.classList.add("sent"); // show success message
  }

  openBtn.addEventListener("click", openModal);
  sendBtn.addEventListener("click", send);
  closeBtns.forEach(function (b) { b.addEventListener("click", closeModal); });

  // Click on the dark overlay (outside the modal) closes it
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "Tab") { // keep focus inside the modal
      var f = modal.querySelectorAll("button, input, textarea");
      var vis = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
      var first = vis[0], last = vis[vis.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
