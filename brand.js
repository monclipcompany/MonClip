function createCampaign(event) {

  event.preventDefault();


  const user = requireRole("BRAND");

  if (!user) return;


  const form =
    event.currentTarget;


  const title =
    form.title.value.trim();


  const description =
    form.description.value.trim();


  const platform =
    form.platform.value;


  const ratePer1000 =
    Number(form.ratePer1000.value);


  const budget =
    Number(form.budget.value);


  const message =
    document.getElementById(
      "campaignMessage"
    );


  if (!title || !description || !platform) {

    message.className = "error";

    message.textContent =
      "Please fill in all fields.";

    return;
  }


  if (
    !Number.isFinite(ratePer1000) ||
    ratePer1000 <= 0
  ) {

    message.className = "error";

    message.textContent =
      "Rate must be greater than 0.";

    return;
  }


  if (
    !Number.isFinite(budget) ||
    budget <= 0
  ) {

    message.className = "error";

    message.textContent =
      "Budget must be greater than 0.";

    return;
  }


  const campaigns =
    getCampaigns();


  const newCampaign = {

    id: uid("campaign"),

    brandId: user.id,

    title: title,

    description: description,

    platform: platform,

    ratePer1000: ratePer1000,

    budget: budget,

    active: true,

    createdAt:
      new Date().toISOString()

  };


  campaigns.push(newCampaign);


  saveCampaigns(campaigns);


  message.className = "success";

  message.textContent =
    "Campaign created successfully.";


  form.reset();


  renderMyCampaigns(user);

}
function renderMyCampaigns(user) {

  const list =
    document.getElementById(
      "myCampaignList"
    );


  const campaigns =
    getCampaigns().filter(
      campaign =>
        campaign.brandId === user.id
    );


  if (campaigns.length === 0) {

    list.innerHTML = `
      <p>
        You have not created any campaigns yet.
      </p>
    `;

    return;
  }


  list.innerHTML = campaigns.map(
    campaign => `

      <div class="card">

        <h3>
          ${escapeHtml(campaign.title)}
        </h3>


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


          <span>
            Status:
            ${
              campaign.active
                ? "ACTIVE"
                : "INACTIVE"
            }
          </span>

        </div>

      </div>

    `
  ).join("");

}