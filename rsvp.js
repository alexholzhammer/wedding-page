// TODO: replace with real Supabase project values once the project exists.
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
const RSVP_TABLE = "rsvps";

const form = document.getElementById("rsvp-form");
const plusOneToggle = document.getElementById("plus-one-toggle");
const plusOneNameField = document.getElementById("plus-one-name-field");
const plusOneNameInput = document.getElementById("plus-one-name");
const celebrationSelect = document.getElementById("celebration");
const accommodationField = document.getElementById("accommodation-field");
const submitBtn = document.getElementById("submit-btn");
const status = document.getElementById("form-status");

plusOneToggle.addEventListener("change", () => {
  plusOneNameField.hidden = !plusOneToggle.checked;
  if (!plusOneToggle.checked) {
    plusOneNameInput.value = "";
  }
});

function updateAccommodationVisibility() {
  const showAccommodation = ["puerto", "both"].includes(celebrationSelect.value);
  accommodationField.hidden = !showAccommodation;
  accommodationField
    .querySelectorAll("input[name='accommodation']")
    .forEach((input) => {
      input.required = showAccommodation;
      if (!showAccommodation) input.checked = false;
    });
}

celebrationSelect.addEventListener("change", updateAccommodationVisibility);
updateAccommodationVisibility();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name"),
    plus_one: plusOneToggle.checked,
    plus_one_name: plusOneToggle.checked ? formData.get("plusOneName") : null,
    celebration: formData.get("celebration"),
    accommodation: accommodationField.hidden ? null : formData.get("accommodation"),
    oaxaca_loop: document.getElementById("oaxaca-loop").checked,
    comments: formData.get("comments"),
  };

  submitBtn.disabled = true;
  status.className = "form-status";
  status.textContent = "Sending...";

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${RSVP_TABLE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Request failed");

    form.reset();
    plusOneNameField.hidden = true;
    updateAccommodationVisibility();
    status.classList.add("success");
    status.textContent = "Thanks! We've got your RSVP.";
  } catch (err) {
    status.classList.add("error");
    status.textContent = "Something went wrong — please try again or message us directly.";
  } finally {
    submitBtn.disabled = false;
  }
});
