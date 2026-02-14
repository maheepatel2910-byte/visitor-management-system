document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("visitorForm");

    /* ==============================
       VISITOR FORM SUBMIT (INDEX)
    ============================== */

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const visitor = {
                name: document.getElementById("name").value,
                mobile: document.getElementById("mobile").value,
                flat: document.getElementById("flat").value,
                purpose: document.getElementById("purpose").value
            };

            fetch("/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(visitor)
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById("message").innerText = "✅ Check-In Successful!";
                form.reset();
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("message").innerText = "❌ Error submitting form";
            });
        });
    }

    loadDashboard();
    loadHostPanel();
});


/* ==============================
   BLOCK → FLAT DROPDOWN LOGIC
============================== */

const flatsData = {
    A: ["A-101", "A-102", "A-103", "A-104"],
    B: ["B-101", "B-102", "B-103", "B-104"],
    C: ["C-101", "C-102", "C-103", "C-104"]
};

function loadFlats() {
    const block = document.getElementById("block").value;
    const flatSelect = document.getElementById("flat");

    flatSelect.innerHTML = '<option value="">Select Flat</option>';

    if (block !== "") {
        flatsData[block].forEach(flat => {
            const option = document.createElement("option");
            option.value = flat;
            option.textContent = flat;
            flatSelect.appendChild(option);
        });
    }
}


/* ==============================
   DASHBOARD FUNCTIONS
============================== */

function loadDashboard() {

    const table = document.getElementById("visitorTable");
    const total = document.getElementById("totalVisitors");

    if (!table) return;

    fetch("/get_visitors")
    .then(res => res.json())
    .then(visitors => {

        total.innerText = visitors.length;
        table.innerHTML = "";

        visitors.forEach(visitor => {
            table.innerHTML += `
                <tr>
                    <td>${visitor.name}</td>
                    <td>${visitor.flat}</td>
                    <td>${visitor.purpose}</td>
                    <td>${visitor.status}</td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.error("Error loading dashboard:", error);
    });
}


/* ==============================
   HOST PANEL FUNCTIONS
============================== */

function loadHostPanel() {

    const container = document.getElementById("hostRequests");
    if (!container) return;

    fetch("/get_visitors")
    .then(res => res.json())
    .then(visitors => {

        container.innerHTML = "";

        visitors.forEach((visitor, index) => {

            if (visitor.status === "Pending") {

                container.innerHTML += `
                    <div class="card">
                        <p><strong>${visitor.name}</strong></p>
                        <p>Flat: ${visitor.flat}</p>
                        <p>Purpose: ${visitor.purpose}</p>
                        <button class="approve" onclick="updateStatus(${index}, 'Approved')">Approve</button>
                        <button class="reject" onclick="updateStatus(${index}, 'Rejected')">Reject</button>
                    </div>
                `;
            }

        });
    })
    .catch(error => {
        console.error("Error loading host panel:", error);
    });
}


/* ==============================
   UPDATE STATUS
============================== */

function updateStatus(index, status) {

    fetch(`/update_status/${index}/${status}`)
    .then(res => res.json())
    .then(data => {
        loadHostPanel();
        loadDashboard();
    })
    .catch(error => {
        console.error("Error updating status:", error);
    });
}