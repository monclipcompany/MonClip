function renderAdminSubmissions() {

  const table =
    document.getElementById(
      "submissionTable"
    );


  const submissions =
    getSubmissions();


  if (submissions.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="8">
          No submissions yet.
        </td>
      </tr>
    `;

    return;
  }


  table.innerHTML = submissions.map(
    submission => {

      const creator =
        findUser(submission.creatorId);


      const campaign =
        findCampaign(submission.campaignId);


      if (!creator || !campaign) {
        return "";
      }


      const isPending =
        submission.status === "PENDING";


      return `

        <tr>

          <td>
            ${escapeHtml(creator.name)}
            <br>
            <small>
              ${escapeHtml(creator.email)}
            </small>
          </td>


          <td>
            ${escapeHtml(campaign.title)}
          </td>


          <td>

            <a
              href="${escapeHtml(submission.videoUrl)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Clip
            </a>

          </td>


          <td>

            ${
              isPending

                ? `

                  <input
                    class="admin-input"
                    id="views-${submission.id}"
                    type="number"
                    min="0"
                    value="${submission.views || 0}"
                  >

                `

                : submission.views
            }

          </td>


          <td>

            ${
              isPending

                ? `

                  <input
                    class="admin-input"
                    id="verified-${submission.id}"
                    type="number"
                    min="0"
                    value="${submission.verifiedViews || 0}"
                  >

                `

                : submission.verifiedViews
            }

          </td>


          <td>
            ${money(submission.earnings)}
          </td>


          <td>

            <span class="badge">

              ${escapeHtml(
                submission.status
              )}

            </span>

          </td>


          <td>

            ${
              isPending

                ? `

                  <button
                    class="btn"
                    onclick="approveSubmission('${submission.id}')"
                  >
                    Approve
                  </button>


                  <button
                    class="btn btn-danger"
                    onclick="rejectSubmission('${submission.id}')"
                  >
                    Reject
                  </button>

                `

                : `

                  <span>
                    Completed
                  </span>

                `
            }

          </td>

        </tr>

      `;

    }
  ).join("");

}
function approveSubmission(submissionId) {

  const user =
    requireRole("ADMIN");

  if (!user) return;


  const submissions =
    getSubmissions();


  const submission =
    submissions.find(
      item =>
        item.id === submissionId
    );


  if (!submission) {

    alert(
      "Submission not found."
    );

    return;
  }


  if (submission.status !== "PENDING") {

    alert(
      "This submission has already been processed."
    );

    return;
  }


  const viewsInput =
    document.getElementById(
      `views-${submissionId}`
    );


  const verifiedInput =
    document.getElementById(
      `verified-${submissionId}`
    );


  const views =
    Number(viewsInput.value);


  const verifiedViews =
    Number(verifiedInput.value);


  if (
    !Number.isFinite(views) ||
    views < 0
  ) {

    alert(
      "Views must be 0 or greater."
    );

    return;
  }


  if (
    !Number.isFinite(verifiedViews) ||
    verifiedViews < 0
  ) {

    alert(
      "Verified views must be 0 or greater."
    );

    return;
  }


  if (verifiedViews > views) {

    alert(
      "Verified views cannot be greater than total views."
    );

    return;
  }


  const campaign =
    findCampaign(
      submission.campaignId
    );


  if (!campaign) {

    alert(
      "Campaign not found."
    );

    return;
  }


  const earnings =
    verifiedViews *
    campaign.ratePer1000 /
    1000;


  submission.views =
    views;


  submission.verifiedViews =
    verifiedViews;


  submission.earnings =
    earnings;


  submission.status =
    "APPROVED";


  saveSubmissions(
    submissions
  );


  const creator =
    findUser(
      submission.creatorId
    );


  if (!creator) {

    alert(
      "Creator account not found."
    );

    return;
  }


  creator.balance =
    Number(creator.balance || 0) +
    earnings;


  const users =
    getUsers();


  const creatorIndex =
    users.findIndex(
      item =>
        item.id === creator.id
    );


  if (creatorIndex !== -1) {

    users[creatorIndex] =
      creator;

    saveUsers(users);

  }


  renderAdminSubmissions();


  showAdminMessage(
    "Submission approved successfully.",
    "success"
  );

}
function rejectSubmission(submissionId) {

  const user =
    requireRole("ADMIN");

  if (!user) return;


  const submissions =
    getSubmissions();


  const submission =
    submissions.find(
      item =>
        item.id === submissionId
    );


  if (!submission) {

    alert(
      "Submission not found."
    );

    return;
  }


  if (submission.status !== "PENDING") {

    alert(
      "This submission has already been processed."
    );

    return;
  }


  submission.status =
    "REJECTED";


  submission.earnings =
    0;


  saveSubmissions(
    submissions
  );


  renderAdminSubmissions();


  showAdminMessage(
    "Submission rejected.",
    "success"
  );

}
function showAdminMessage(
  text,
  type
) {

  const message =
    document.getElementById(
      "adminMessage"
    );


  message.className =
    type;


  message.textContent =
    text;

}