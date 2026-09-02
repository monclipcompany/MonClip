document.addEventListener("DOMContentLoaded", () => {

  const user = requireAuth();

  if (!user) return;


  const list = document.getElementById("campaignList");

  const campaigns = getCampaigns()
    .filter(campaign => campaign.active);


  if (campaigns.length === 0) {

    list.innerHTML = `
      <div class="card">
        <p>No active campaigns yet.</p>
      </div>
    `;

    return;
  }


  list.innerHTML = campaigns.map(campaign => `

    <div class="card campaign-card">

      <h2>
        ${escapeHtml(campaign.title)}
      </h2>


      <p>
        ${escapeHtml(campaign.description)}
      </p>


      <div class="campaign-meta">

        <span>
          Platform:
          ${escapeHtml(campaign.platform)}
        </span>


        <span>
          Rate:
          ${money(campaign.ratePer1000)}
          / 1,000 views
        </span>


        <span>
          Budget:
          ${money(campaign.budget)}
        </span>

      </div>


      ${
        hasRole(user, "CREATOR")

        ? `

          <form
            class="submit-form"
            data-campaign="${campaign.id}"
          >

            <label for="video-${campaign.id}">
              Clip URL
            </label>


            <input
              id="video-${campaign.id}"
              name="videoUrl"
              type="url"
              placeholder="https://..."
              required
            >


            <button
              class="btn"
              type="submit"
            >
              Submit Clip
            </button>


            <p class="submit-message"></p>

          </form>

        `

        : `

          <p>
            You need the Creator role to submit a clip.
          </p>

        `
      }

    </div>

  `).join("");


  document
    .querySelectorAll(".submit-form")
    .forEach(form => {

      form.addEventListener(
        "submit",
        submitClip
      );

    });

});


function submitClip(event) {

  event.preventDefault();


  const user = requireAuth();

  if (!user) return;


  if (!hasRole(user, "CREATOR")) {

    alert(
      "This account does not have the Creator role."
    );

    return;
  }


  const form = event.currentTarget;

  const campaignId =
    form.dataset.campaign;


  const videoUrl =
    form.videoUrl.value.trim();


  const message =
    form.querySelector(".submit-message");


  if (!/^https?:\/\//i.test(videoUrl)) {

    message.className = "error";

    message.textContent =
      "Please enter a valid URL.";

    return;
  }


  const submissions =
    getSubmissions();


  const duplicate =
    submissions.some(item =>

      item.creatorId === user.id &&

      item.campaignId === campaignId &&

      item.videoUrl === videoUrl

    );


  if (duplicate) {

    message.className = "error";

    message.textContent =
      "You have already submitted this URL.";

    return;
  }


  submissions.push({

    id: uid("submission"),

    creatorId: user.id,

    campaignId: campaignId,

    videoUrl: videoUrl,

    views: 0,

    verifiedViews: 0,

    earnings: 0,

    status: "PENDING",

    createdAt:
      new Date().toISOString()

  });


  saveSubmissions(submissions);


  message.className = "success";

  message.textContent =
    "Clip submitted successfully.";


  form.reset();

}