/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = "http://localhost:8080/api";


/* =========================================================
   LOGIN VARIABLES
========================================================= */

let selectedRole = "ADMIN";

let currentUsername = "";

let currentPassword = "";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    showLoginPage();

});


/* =========================================================
   LOGIN PAGE
========================================================= */

function showLoginPage() {

    const loginPage = document.getElementById("loginPage");
    const app = document.getElementById("app");

    if (loginPage) {
        loginPage.style.display = "flex";
    }

    if (app) {
        app.style.display = "none";
    }

}


/* =========================================================
   ROLE SELECTION
========================================================= */

function selectRole(role) {

    selectedRole = role;

    const adminRole = document.getElementById("adminRole");
    const staffRole = document.getElementById("staffRole");

    if (adminRole) {
        adminRole.classList.remove("active");
    }

    if (staffRole) {
        staffRole.classList.remove("active");
    }

    if (role === "ADMIN" && adminRole) {
        adminRole.classList.add("active");
    }

    if (role === "STAFF" && staffRole) {
        staffRole.classList.add("active");
    }

}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

function togglePassword() {

    const passwordInput =
        document.getElementById("loginPassword");

    const button =
        document.querySelector(".password-toggle");

    if (!passwordInput) {
        return;
    }

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        if (button) {
            button.textContent = "◉";
        }

    } else {

        passwordInput.type = "password";

        if (button) {
            button.textContent = "◉";
        }

    }

}


/* =========================================================
   LOGIN
========================================================= */

async function login(event) {

    event.preventDefault();

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const message =
        document.getElementById("loginMessage");

    const loginButton =
        document.getElementById("loginButton");


    if (!username || !password) {

        showLoginMessage(
            "Please enter username and password.",
            "error"
        );

        return;
    }


    currentUsername = username;
    currentPassword = password;


    if (loginButton) {

        loginButton.disabled = true;

        loginButton.innerHTML = `
            <span>Signing in...</span>
        `;

    }


    try {

        /*
           Test username and password
           using Spring Security.
        */

        const response = await fetch(
            `${API_BASE_URL}/products`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Basic " +
                        btoa(`${username}:${password}`)
                }
            }
        );


        if (!response.ok) {

            if (response.status === 401) {

                throw new Error(
                    "Invalid username or password."
                );

            }

            if (response.status === 403) {

                throw new Error(
                    "You do not have permission to access the system."
                );

            }

            throw new Error(
                "Login failed. Please try again."
            );

        }


        await response.json();


        /*
           Store login information.
        */

        localStorage.setItem(
            "stockmasterUsername",
            username
        );

        localStorage.setItem(
            "stockmasterRole",
            selectedRole
        );
        const headerUsername =
    document.getElementById("headerUsername");

const headerRole =
    document.getElementById("headerRole");

if (headerUsername) {
    headerUsername.textContent = username;
}

if (headerRole) {
    headerRole.textContent = selectedRole;
}


        /*
           Update Admin-only controls.
        */

        updateAdminControls();


        /*
           Hide login page.
        */

        const loginPage =
            document.getElementById("loginPage");

        const app =
            document.getElementById("app");


        if (loginPage) {
            loginPage.style.display = "none";
        }

        if (app) {
            app.style.display = "block";
        }


        /*
           Load application data.
        */

        loadDashboard();

        loadProducts();


        /*
           Reset login button.
        */

        if (loginButton) {

            loginButton.disabled = false;

            loginButton.innerHTML = `
                <span>Sign in</span>
                <span>→</span>
            `;

        }

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showLoginMessage(
            error.message,
            "error"
        );


        if (loginButton) {

            loginButton.disabled = false;

            loginButton.innerHTML = `
                <span>Sign in</span>
                <span>→</span>
            `;

        }

    }

}


/* =========================================================
   ADMIN CONTROLS
========================================================= */

function updateAdminControls() {

    const role =
        localStorage.getItem("stockmasterRole");

    const addProductButton =
        document.getElementById("addProductButton");


    if (!addProductButton) {
        return;
    }


    if (role === "ADMIN") {

        addProductButton.style.display = "inline-flex";

    } else {

        addProductButton.style.display = "none";

    }

}


/* =========================================================
   LOGIN MESSAGE
========================================================= */

function showLoginMessage(message, type) {

    const element =
        document.getElementById("loginMessage");


    if (!element) {
        return;
    }


    element.textContent = message;


    if (type === "error") {

        element.style.color = "#dc2626";

    } else {

        element.style.color = "#16a34a";

    }

}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

function googleLogin() {

    showLoginMessage(
        "Google sign-up/login will be connected later.",
        "error"
    );

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function showForgotPassword() {

    showLoginMessage(
        "Password recovery will be added later.",
        "error"
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    currentUsername = "";

    currentPassword = "";


    localStorage.removeItem(
        "stockmasterUsername"
    );

    localStorage.removeItem(
        "stockmasterRole"
    );


    const loginPage =
        document.getElementById("loginPage");

    const app =
        document.getElementById("app");


    if (app) {
        app.style.display = "none";
    }

    if (loginPage) {
        loginPage.style.display = "flex";
    }


    const username =
        document.getElementById("loginUsername");

    const password =
        document.getElementById("loginPassword");


    if (username) {
        username.value = "";
    }

    if (password) {
        password.value = "";
    }


    /*
       Reset role to Admin.
    */

    selectRole("ADMIN");

}


/* =========================================================
   API AUTHORIZATION HEADER
========================================================= */

function getAuthHeaders() {

    if (!currentUsername || !currentPassword) {

        return {};

    }


    return {

        "Authorization":
            "Basic " +
            btoa(
                `${currentUsername}:${currentPassword}`
            ),

        "Content-Type":
            "application/json"

    };

}


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(sectionId, clickedButton) {

    const sections =
        document.querySelectorAll(".section");


    sections.forEach(function (section) {

        section.classList.add("hidden");

    });


    const selectedSection =
        document.getElementById(sectionId);


    if (selectedSection) {

        selectedSection.classList.remove("hidden");

    }


    const menuButtons =
        document.querySelectorAll(".menu");


    menuButtons.forEach(function (button) {

        button.classList.remove("active");

    });


    if (clickedButton) {

        clickedButton.classList.add("active");

    }


    if (sectionId === "dashboard") {

        loadDashboard();

    }


    if (sectionId === "products") {

        loadProducts();

        updateAdminControls();

    }


    if (sectionId === "transactions") {

        loadTransactions();

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/dashboard`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load dashboard."
            );

        }


        const data =
            await response.json();


        setText(
            "totalProducts",
            data.totalProducts ?? 0
        );

        setText(
            "totalStock",
            data.totalStock ?? 0
        );

        setText(
            "lowStockProducts",
            data.lowStockProducts ?? 0
        );

        setText(
            "totalTransactions",
            data.totalTransactions ?? 0
        );


        setText(
            "overviewProducts",
            data.totalProducts ?? 0
        );

        setText(
            "overviewStock",
            data.totalStock ?? 0
        );

        setText(
            "overviewLowStock",
            data.lowStockProducts ?? 0
        );

        setText(
            "overviewTransactions",
            data.totalTransactions ?? 0
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


/* =========================================================
   PRODUCTS
========================================================= */

async function loadProducts() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/products`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load products."
            );

        }


        const products =
            await response.json();


        const tableBody =
            document.getElementById(
                "productTableBody"
            );


        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        if (products.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7"
                        style="text-align:center;">
                        No products found.
                    </td>
                </tr>
            `;

            return;

        }


        products.forEach(function (product) {

            const row =
                document.createElement("tr");


            let status = "In Stock";


            if (
                product.quantity <=
                product.minimumStock
            ) {

                status = "Low Stock";

            }


            row.innerHTML = `

                <td>
                    ${product.id}
                </td>

                <td>
                    ${escapeHtml(product.name)}
                </td>

                <td>
                    ${escapeHtml(product.sku)}
                </td>

                <td>
                    ₹${Number(product.price)
                        .toLocaleString("en-IN")}
                </td>

                <td>
                    ${product.quantity}
                </td>

                <td>
                    ${product.minimumStock}
                </td>

                <td>
                    <span class="status-badge ${
                        status === "Low Stock"
                            ? "low-stock"
                            : "in-stock"
                    }">
                        ${status}
                    </span>
                </td>

            `;


            tableBody.appendChild(row);

        });


        /*
           Make sure Admin button visibility
           is correct whenever products load.
        */

        updateAdminControls();


    } catch (error) {

        console.error(
            "Products error:",
            error
        );

    }

}


/* =========================================================
   ADD PRODUCT
========================================================= */

function openAddProductModal() {

    const modal =
        document.getElementById("addProductModal");


    if (!modal) {
        return;
    }


    /*
       Extra frontend check.
    */

    const role =
        localStorage.getItem("stockmasterRole");


    if (role !== "ADMIN") {

        showLoginMessage(
            "Only Admin can add products.",
            "error"
        );

        return;

    }


    modal.style.display = "flex";

}


function closeAddProductModal() {

    const modal =
        document.getElementById("addProductModal");


    if (modal) {

        modal.style.display = "none";

    }

}


async function addProduct() {

    /*
       Check Admin role.
    */

    const role =
        localStorage.getItem("stockmasterRole");


    if (role !== "ADMIN") {

        return;

    }


    const name =
        document.getElementById("productName")
            .value.trim();

    const sku =
        document.getElementById("productSku")
            .value.trim();

    const price =
        Number(
            document.getElementById("productPrice")
                .value
        );

    const quantity =
        Number(
            document.getElementById("productQuantity")
                .value
        );

    const minimumStock =
        Number(
            document.getElementById("productMinimumStock")
                .value
        );


    const message =
        document.getElementById(
            "addProductMessage"
        );


    /*
       Validation.
    */

    if (
        !name ||
        !sku ||
        price <= 0 ||
        quantity < 0 ||
        minimumStock < 0
    ) {

        if (message) {

            message.textContent =
                "Please enter valid product details.";

            message.style.color =
                "#dc2626";

        }

        return;

    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/products`,
            {
                method: "POST",

                headers: getAuthHeaders(),

                body: JSON.stringify({
                    name: name,
                    sku: sku,
                    price: price,
                    quantity: quantity,
                    minimumStock: minimumStock
                })
            }
        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (response.status === 403) {

            if (message) {

                message.textContent =
                    "Only Admin can add products.";

                message.style.color =
                    "#dc2626";

            }

            return;

        }


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to add product."
            );

        }


        await response.json();


        if (message) {

            message.textContent =
                "Product added successfully!";

            message.style.color =
                "#16a34a";

        }


        /*
           Clear form.
        */

        document.getElementById(
            "productName"
        ).value = "";

        document.getElementById(
            "productSku"
        ).value = "";

        document.getElementById(
            "productPrice"
        ).value = "";

        document.getElementById(
            "productQuantity"
        ).value = "";

        document.getElementById(
            "productMinimumStock"
        ).value = "";


        /*
           Refresh dashboard and products.
        */

        await loadProducts();

        await loadDashboard();


        /*
           Close modal.
        */

        setTimeout(function () {

            closeAddProductModal();

        }, 800);


    } catch (error) {

        console.error(
            "Add Product error:",
            error
        );


        if (message) {

            message.textContent =
                error.message ||
                "Failed to add product.";

            message.style.color =
                "#dc2626";

        }

    }

}


/* =========================================================
   STOCK IN
========================================================= */

async function stockIn() {

    const productId =
        document.getElementById(
            "stockProductId"
        ).value;


    const quantity =
        document.getElementById(
            "stockQuantity"
        ).value;


    if (!productId || !quantity) {

        showStockMessage(
            "Please enter product ID and quantity.",
            "error"
        );

        return;

    }


    if (Number(quantity) <= 0) {

        showStockMessage(
            "Quantity must be greater than 0.",
            "error"
        );

        return;

    }


    try {

        const response = await fetch(

            `${API_BASE_URL}/stock/in/${productId}?quantity=${quantity}`,

            {
                method: "POST",
                headers: getAuthHeaders()
            }

        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Stock IN failed."
            );

        }


        await response.json();


        showStockMessage(
            "Stock IN completed successfully.",
            "success"
        );


        document.getElementById(
            "stockQuantity"
        ).value = "";


        loadDashboard();

        loadProducts();


    } catch (error) {

        console.error(
            "Stock IN error:",
            error
        );


        showStockMessage(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   STOCK OUT
========================================================= */

async function stockOut() {

    const productId =
        document.getElementById(
            "stockProductId"
        ).value;


    const quantity =
        document.getElementById(
            "stockQuantity"
        ).value;


    if (!productId || !quantity) {

        showStockMessage(
            "Please enter product ID and quantity.",
            "error"
        );

        return;

    }


    if (Number(quantity) <= 0) {

        showStockMessage(
            "Quantity must be greater than 0.",
            "error"
        );

        return;

    }


    try {

        const response = await fetch(

            `${API_BASE_URL}/stock/out/${productId}?quantity=${quantity}`,

            {
                method: "POST",
                headers: getAuthHeaders()
            }

        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Stock OUT failed."
            );

        }


        await response.json();


        showStockMessage(
            "Stock OUT completed successfully.",
            "success"
        );


        document.getElementById(
            "stockQuantity"
        ).value = "";


        loadDashboard();

        loadProducts();


    } catch (error) {

        console.error(
            "Stock OUT error:",
            error
        );


        showStockMessage(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   STOCK MESSAGE
========================================================= */

function showStockMessage(message, type) {

    const element =
        document.getElementById(
            "stockMessage"
        );


    if (!element) {
        return;
    }


    element.textContent = message;


    if (type === "success") {

        element.style.color = "#16a34a";

    } else {

        element.style.color = "#dc2626";

    }

}


/* =========================================================
   TRANSACTIONS
========================================================= */

async function loadTransactions() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/stock/transactions`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load transactions."
            );

        }


        const transactions =
            await response.json();


        const tableBody =
            document.getElementById(
                "transactionTableBody"
            );


        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        if (transactions.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="text-align:center;">
                        No transactions found.
                    </td>
                </tr>
            `;

            return;

        }


        transactions.forEach(function (transaction) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${transaction.id}
                </td>

                <td>
                    ${transaction.productId}
                </td>

                <td>
                    ${escapeHtml(transaction.type)}
                </td>

                <td>
                    ${transaction.quantity}
                </td>

                <td>
                    ${formatDate(
                        transaction.transactionDate
                    )}
                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Transactions error:",
            error
        );

    }

}


/* =========================================================
   LOW STOCK PRODUCTS
========================================================= */

async function loadLowStockProducts() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/products/low-stock`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load low stock products."
            );

        }


        return await response.json();


    } catch (error) {

        console.error(
            "Low stock error:",
            error
        );

        return [];

    }

}


/* =========================================================
   HELPER - SET TEXT
========================================================= */

function setText(elementId, value) {

    const element =
        document.getElementById(elementId);


    if (element) {

        element.textContent = value;

    }

}


/* =========================================================
   HELPER - FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return dateValue;

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",

            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   HELPER - ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   INITIALIZE APPLICATION
========================================================= */

function initializeApplication() {

    loadDashboard();

    loadProducts();

    updateAdminControls();

}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (message) {

                message.textContent = "";

            }


            /*
               Close Add Product modal
               when pressing Escape.
            */

            closeAddProductModal();

        }

    }
);