document.addEventListener(
  "DOMContentLoaded",
  () => {

    const user = requireAuth();

    if (!user) {
      return;
    }


    const currentUser =
      syncCurrentUser();

    if (!currentUser) {
      return;
    }


    // =========================
    // USER INFORMATION
    // =========================

    document
      .getElementById("userName")
      .textContent =
      currentUser.name;


    document
      .getElementById("userRoles")
      .innerHTML =
      currentUser.roles
        .map(
          role => `
            <span class="badge-role">
              ${escapeHtml(role)}
            </span>
          `
        )
        .join("");


    // =========================
    // SECTIONS
    // =========================

    const creatorSection =
      document.getElementById(
        "creatorSection"
      );

    const brandSection =
      document.getElementById(
        "brandSection"
      );

    const adminSection =
      document.getElementById(
        "adminSection"
      );


    const brandLink =
      document.getElementById(
        "brandLink"
      );

    const adminLink =
      document.getElementById(
        "adminLink"
      );


    // =========================
    // CREATOR
    // =========================

    if (
      !hasRole(
        currentUser,
        "CREATOR"
      )
    ) {

      creatorSection
        .classList
        .add("hidden");

    }


    // =========================
    // BRAND
    // =========================

    if (
      !hasRole(
        currentUser,
        "BRAND"
      )
    ) {

      brandSection
        .classList
        .add("hidden");

      brandLink
        .classList
        .add("hidden");

    }
    else {

      brandSection
        .classList
        .remove("hidden");

    }


    // =========================
    // ADMIN
    // =========================

    if (
      !hasRole(
        currentUser,
        "ADMIN"
      )
    ) {

      adminSection
        .classList
        .add("hidden");

      adminLink
        .classList
        .add("hidden");

    }
    else {

      adminSection
        .classList
        .remove("hidden");

    }


    // =========================
    // CREATOR DATA
    // =========================

    if (
      hasRole(
        currentUser,
        "CREATOR"
      )
    ) {

      renderCreatorDashboard(
        currentUser
      );

    }

  }
);


// ==================================
// RENDER CREATOR DASHBOARD
// ==================================

function renderCreatorDashboard(
  user
) {

  const submissions =
    getSubmissions()
      .filter(
        submission =>
          submission.creatorId === user.id
      );


  // =========================
  // COUNTS
  // =========================

  const approved =
    submissions.filter(
      submission =>
        submission.status === "APPROVED"
    );


  const totalEarnings =
    approved.reduce(
      (total, submission) =>
        total +
        Number(
          submission.earnings || 0
        ),
      0
    );


  // =========================
  // STATS
  // =========================

  document
    .getElementById("balance")
    .textContent =
    money(user.balance);


  document
    .getElementById("submissionCount")
    .textContent =
    submissions.length;


  document
    .getElementById("approvedCount")
    .textContent =
    approved.length;


  document
    .getElementById("earnings")
    .textContent =
    money(totalEarnings);


  // =========================
  // TABLE
  // =========================

  const table =
    document.getElementById(
      "submissionTable"
    );


  if (
    submissions.length === 0
  ) {

    table.innerHTML = `
      <tr>

        <td colspan="5">

          No submissions yet.

          <br><br>

          <a
            class="btn"
            href="campaigns.html"
          >
            Find a Campaign
          </a>

        </td>

      </tr>
    `;

    return;
  }


  table.innerHTML =
    submissions
      .map(
        submission => {

          const campaign =
            findCampaign(
              submission.campaignId
            );


          return `
            <tr>

              <td>
                ${
                  escapeHtml(
                    campaign?.title ||
                    "Unknown Campaign"
                  )
                }
              </td>


              <td>
                ${
                  escapeHtml(
                    submission.status
                  )
                }
              </td>


              <td>
                ${
                  Number(
                    submission.views || 0
                  ).toLocaleString()
                }
              </td>


              <td>
                ${
                  Number(
                    submission.verifiedViews ||
                    0
                  ).toLocaleString()
                }
              </td>


              <td>
                ${
                  money(
                    submission.earnings
                  )
                }
              </td>

            </tr>
          `;

        }
      )
      .join("");

}