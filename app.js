// ========================================
// MONCLIP - SHARED APP.JS
// ========================================


// ========================================
// STORAGE KEYS
// ========================================

const KEYS = {

  users: "monclip_users",

  campaigns: "monclip_campaigns",

  submissions: "monclip_submissions",

  payouts: "monclip_payouts",

  currentUser: "monclip_current_user"

};


// ========================================
// DEMO ADMIN ACCOUNT
// ========================================

const DEMO_ADMIN = {

  id: "admin-001",

  name: "Monclip Admin",

  email: "admin@monclip.local",

  password: "admin1234",

  roles: [
    "CREATOR",
    "BRAND",
    "ADMIN"
  ],

  balance: 0,

  createdAt:
    new Date().toISOString()

};


// ========================================
// BASIC STORAGE FUNCTIONS
// ========================================

function getData(key) {

  try {

    const data =
      localStorage.getItem(key);

    return data
      ? JSON.parse(data)
      : [];

  } catch (error) {

    console.error(
      "Storage error:",
      error
    );

    return [];

  }

}


function saveData(key, data) {

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );

}


// ========================================
// USERS
// ========================================

function getUsers() {

  return getData(
    KEYS.users
  );

}


function saveUsers(users) {

  saveData(
    KEYS.users,
    users
  );

}


// ========================================
// CAMPAIGNS
// ========================================

function getCampaigns() {

  return getData(
    KEYS.campaigns
  );

}


function saveCampaigns(campaigns) {

  saveData(
    KEYS.campaigns,
    campaigns
  );

}


// ========================================
// SUBMISSIONS
// ========================================

function getSubmissions() {

  return getData(
    KEYS.submissions
  );

}


function saveSubmissions(
  submissions
) {

  saveData(
    KEYS.submissions,
    submissions
  );

}


// ========================================
// PAYOUTS
// ========================================

function getPayouts() {

  return getData(
    KEYS.payouts
  );

}


function savePayouts(payouts) {

  saveData(
    KEYS.payouts,
    payouts
  );

}


// ========================================
// CURRENT USER
// ========================================

function getCurrentUser() {

  try {

    const data =
      localStorage.getItem(
        KEYS.currentUser
      );

    return data
      ? JSON.parse(data)
      : null;

  } catch (error) {

    console.error(
      "Current user error:",
      error
    );

    return null;

  }

}


function setCurrentUser(user) {

  if (!user) {

    localStorage.removeItem(
      KEYS.currentUser
    );

    return;

  }


  localStorage.setItem(
    KEYS.currentUser,
    JSON.stringify(user)
  );

}


// ========================================
// LOGOUT
// ========================================

function logout() {

  localStorage.removeItem(
    KEYS.currentUser
  );

  window.location.href =
    "login.html";

}


// ========================================
// FIND USER
// ========================================

function findUser(id) {

  return getUsers().find(
    user =>
      user.id === id
  );

}


// ========================================
// FIND CAMPAIGN
// ========================================

function findCampaign(id) {

  return getCampaigns().find(
    campaign =>
      campaign.id === id
  );

}


// ========================================
// CHECK ROLE
// ========================================

function hasRole(
  user,
  role
) {

  if (!user) {
    return false;
  }


  if (!Array.isArray(user.roles)) {
    return false;
  }


  return user.roles.includes(
    role
  );

}


// ========================================
// MONEY FORMAT
// ========================================

function money(amount) {

  const value =
    Number(amount) || 0;


  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(value);

}


// ========================================
// GENERATE UNIQUE ID
// ========================================

function uid(prefix) {

  return (
    prefix +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );

}


// ========================================
// HTML ESCAPE
// ========================================

function escapeHtml(value) {

  if (value === null ||
      value === undefined) {

    return "";

  }


  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// ========================================
// REQUIRE LOGIN
// ========================================

function requireAuth() {

  const user =
    getCurrentUser();


  if (!user) {

    window.location.href =
      "login.html";

    return null;

  }


  return user;

}


// ========================================
// REQUIRE ROLE
// ========================================

function requireRole(role) {

  const user =
    requireAuth();


  if (!user) {
    return null;
  }


  if (!hasRole(user, role)) {

    alert(
      "You do not have permission to access this page."
    );


    window.location.href =
      "dashboard.html";


    return null;

  }


  return user;

}


// ========================================
// SYNC CURRENT USER
// ========================================

function syncCurrentUser() {

  const current =
    getCurrentUser();


  if (!current) {
    return null;
  }


  const user =
    findUser(current.id);


  if (!user) {

    logout();

    return null;

  }


  setCurrentUser(user);


  return user;

}


// ========================================
// INITIAL DATA
// ========================================

function initData() {

  // --------------------------------------
  // Users
  // --------------------------------------

  let users =
    getUsers();


  const adminExists =
    users.some(
      user =>
        user.email ===
        DEMO_ADMIN.email
    );


  if (!adminExists) {

    users.push(
      DEMO_ADMIN
    );

    saveUsers(users);

  }


  // --------------------------------------
  // Campaigns
  // --------------------------------------

  let campaigns =
    getCampaigns();


  if (campaigns.length === 0) {

    campaigns = [

      {

        id: "campaign-001",

        brandId:
          DEMO_ADMIN.id,

        title:
          "Demo TikTok Campaign",

        description:
          "Create a short clip about our product.",

        platform:
          "TikTok",

        ratePer1000:
          1,

        budget:
          5000,

        active:
          true,

        createdAt:
          new Date().toISOString()

      },


      {

        id: "campaign-002",

        brandId:
          DEMO_ADMIN.id,

        title:
          "Demo YouTube Shorts",

        description:
          "Create a YouTube Shorts video.",

        platform:
          "YouTube",

        ratePer1000:
          0.8,

        budget:
          3000,

        active:
          true,

        createdAt:
          new Date().toISOString()

      }

    ];


    saveCampaigns(
      campaigns
    );

  }


  // --------------------------------------
  // Submissions
  // --------------------------------------

  if (
    localStorage.getItem(
      KEYS.submissions
    ) === null
  ) {

    saveSubmissions([]);

  }


  // --------------------------------------
  // Payouts
  // --------------------------------------

  if (
    localStorage.getItem(
      KEYS.payouts
    ) === null
  ) {

    savePayouts([]);

  }

}


// ========================================
// LOGOUT BUTTON
// ========================================

function setupLogoutButtons() {

  const buttons =
    document.querySelectorAll(
      ".logout-btn"
    );


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      logout
    );

  });

}


// ========================================
// APP START
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initData();

    setupLogoutButtons();

  }
);