// ======================================================
// Abdelrahman Hachem Portfolio
// Main JavaScript
// ======================================================

// ---------- Helpers ----------

const q = (selector) => document.querySelector(selector);
const el = (id) => document.getElementById(id);

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

// Add cache-busting to CMS/media files
function withCacheBust(url) {
  if (!url) return "";

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${Date.now()}`;
}


// ---------- JSON Loader ----------

async function getJSON(path, fallback = []) {
  try {
    const response = await fetch(
      `${path}?v=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      console.warn(
        `Could not load ${path}. HTTP status: ${response.status}`
      );

      return fallback;
    }

    return await response.json();

  } catch (error) {

    console.warn(
      `Could not load ${path}`,
      error
    );

    return fallback;
  }
}


// ---------- Homepage / Site Information ----------

function renderSite(site) {

  const name =
    site.name ||
    "Abdelrahman Hachem";

  document.title =
    `${name} | Engineering Portfolio`;


  // Logo
  if (el("brandText")) {
    el("brandText").textContent =
      site.short_name || "AH";
  }


  // Hero eyebrow
  if (el("heroEyebrow")) {
    el("heroEyebrow").textContent =
      site.eyebrow || "";
  }


  // Name
  if (el("heroName")) {

    const nameParts =
      name.trim().split(/\s+/);

    if (nameParts.length > 1) {

      const firstName =
        escapeHTML(nameParts.shift());

      const rest =
        escapeHTML(nameParts.join(" "));

      el("heroName").innerHTML =
        `${firstName}<br><span>${rest}</span>`;

    } else {

      el("heroName").textContent = name;

    }
  }


  // Intro
  if (el("heroIntro")) {
    el("heroIntro").textContent =
      site.intro || "";
  }


  // Headline
  if (el("headline")) {

    const headline =
      escapeHTML(site.headline || "");

    el("headline").innerHTML =
      headline.replace(
        /working systems\.?/i,
        "<span>$&</span>"
      );
  }


  // About
  if (el("aboutText")) {
    el("aboutText").textContent =
      site.about || "";
  }


  // Contact
  if (el("contactHeading")) {
    el("contactHeading").textContent =
      site.contact_heading || "";
  }

  if (el("contactText")) {
    el("contactText").textContent =
      site.contact_text || "";
  }


  // Footer
  if (el("footerName")) {
    el("footerName").textContent =
      name;
  }

  if (el("footerLocation")) {
    el("footerLocation").textContent =
      site.location || "";
  }


  // ---------- Profile Image ----------

const portraitShell = el("portraitShell");

if (portraitShell) {

  // Use CMS image if available.
  // Otherwise use the known working profile image.
  const profileImage =
    site.profile_image && String(site.profile_image).trim() !== ""
      ? site.profile_image
      : "/assets/profile.png";

  const img = document.createElement("img");

  img.src = `${profileImage}?v=${Date.now()}`;
  img.alt = site.name || "Abdelrahman Hachem";
  img.loading = "eager";
  img.decoding = "async";

  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";

  img.onload = () => {
    console.log("Profile image loaded:", profileImage);
  };

  img.onerror = () => {
    console.error("Profile image failed:", profileImage);

    // Final emergency fallback
    if (!img.src.includes("/assets/profile.png")) {
      img.src = `/assets/profile.png?v=${Date.now()}`;
    }
  };

  portraitShell.innerHTML = "";
  portraitShell.appendChild(img);
}

  // ---------- CV ----------

  const cvButton =
    el("cvButton");

  if (cvButton) {

    if (
      site.cv &&
      String(site.cv).trim() !== ""
    ) {

      cvButton.href =
        site.cv;

      cvButton.classList.remove(
        "hidden"
      );

    } else {

      cvButton.classList.add(
        "hidden"
      );

    }
  }


  // ---------- Contact Buttons ----------

  const contactActions =
    el("contactActions");

  if (contactActions) {

    const links = [];


    if (site.linkedin) {

      links.push({
        label: "LinkedIn",
        url: site.linkedin
      });

    }


    if (site.github) {

      links.push({
        label: "GitHub",
        url: site.github
      });

    }


    if (site.email) {

      links.push({
        label: "Email",
        url: `mailto:${site.email}`
      });

    }


    contactActions.innerHTML =
      links.map((item, index) => {

        const external =
          !item.url.startsWith("mailto:");

        return `
          <a
            class="btn ${
              index === 0
                ? "primary"
                : "secondary"
            }"
            href="${escapeHTML(item.url)}"
            ${
              external
                ? 'target="_blank" rel="noopener"'
                : ""
            }
          >
            ${escapeHTML(item.label)}
          </a>
        `;

      }).join("");

  }
}


// ---------- Projects ----------

function renderProjects(projects) {

  const grid =
    el("projectGrid");

  if (!grid) return;


  if (
    !Array.isArray(projects) ||
    projects.length === 0
  ) {

    grid.innerHTML = `
      <div class="empty-section">
        <p>
          Projects will be added soon.
        </p>
      </div>
    `;

    return;
  }


  const sorted =
    [...projects].sort(
      (a, b) =>
        Number(Boolean(b.featured)) -
        Number(Boolean(a.featured))
    );


  grid.innerHTML =
    sorted.map((project) => {

      const technologies =
        Array.isArray(project.technologies)
          ? project.technologies
          : [];


      const tags =
        technologies
          .slice(0, 5)
          .map(
            (technology) =>
              `<span>${escapeHTML(
                technology
              )}</span>`
          )
          .join("");


      const imageHTML =
        project.cover_image
          ? `
            <img
              src="${withCacheBust(
                escapeHTML(
                  project.cover_image
                )
              )}"
              alt="${escapeHTML(
                project.title || "Project"
              )}"
              loading="lazy"
              onerror="
                this.style.display='none';
                this.parentElement
                  .querySelector('.placeholder-mark')
                  .style.display='block';
              "
            >

            <div
              class="placeholder-mark"
              style="display:none"
            >
              ${escapeHTML(
                (
                  project.title ||
                  "PR"
                )
                  .slice(0, 2)
                  .toUpperCase()
              )}
            </div>
          `
          : `
            <div class="placeholder-mark">
              ${escapeHTML(
                (
                  project.title ||
                  "PR"
                )
                  .slice(0, 2)
                  .toUpperCase()
              )}
            </div>
          `;


      return `
        <a
          class="project-card"
          href="project.html?project=${encodeURIComponent(
            project.slug || ""
          )}"
        >

          <div class="project-image">
            ${imageHTML}
          </div>

          <div class="project-body">

            <div class="project-tags">
              ${tags}
            </div>

            <h3>
              ${escapeHTML(
                project.title ||
                "Untitled Project"
              )}
            </h3>

            <p>
              ${escapeHTML(
                project.summary || ""
              )}
            </p>

            <span class="project-link">
              View project →
            </span>

          </div>

        </a>
      `;

    }).join("");
}


// ---------- Skills ----------

function renderSkills(groups) {

  const container =
    el("skillsGrid");

  if (!container) return;


  if (
    !Array.isArray(groups) ||
    groups.length === 0
  ) {

    container.innerHTML = "";

    return;
  }


  container.innerHTML =
    groups.map((group) => {

      const items =
        Array.isArray(group.items)
          ? group.items
          : [];

      return `
        <div class="skill-group">

          <h3>
            ${escapeHTML(
              group.category ||
              "Skills"
            )}
          </h3>

          <p>
            ${items
              .map(escapeHTML)
              .join(" • ")}
          </p>

        </div>
      `;

    }).join("");
}


// ---------- Teaching ----------

function renderTeaching(items) {

  const container =
    el("teachingList");

  if (!container) return;


  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {

    container.innerHTML = "";

    return;
  }


  container.innerHTML =
    items.map((item) => `

      <div class="timeline-item">

        <span>
          ${escapeHTML(
            item.organization ||
            "TEACHING"
          )}
        </span>

        <h3>
          ${escapeHTML(
            item.role || ""
          )}
        </h3>

        <p>
          ${escapeHTML(
            item.description || ""
          )}
        </p>

      </div>

    `).join("");
}


// ---------- Research ----------

function renderResearch(items) {

  const container =
    el("researchList");

  if (!container) return;


  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {

    container.innerHTML = "";

    return;
  }


  container.innerHTML =
    items.map((item) => `

      <article class="research-card">

        <p class="publication-type">
          ${escapeHTML(
            item.publication ||
            "RESEARCH"
          )}
        </p>

        <h3>
          ${escapeHTML(
            item.title || ""
          )}
        </h3>

        <p>
          ${escapeHTML(
            item.description || ""
          )}
        </p>

        ${
          item.url
            ? `
              <a
                href="${escapeHTML(
                  item.url
                )}"
                target="_blank"
                rel="noopener"
              >
                Open publication →
              </a>
            `
            : ""
        }

      </article>

    `).join("");
}


// ---------- Navigation & Animations ----------

function setupInteractions() {

  const toggle =
    q(".menu-toggle");

  const nav =
    q(".nav");


  if (toggle && nav) {

    toggle.addEventListener(
      "click",
      () => {

        nav.classList.toggle(
          "open"
        );

      }
    );


    nav
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {

            nav.classList.remove(
              "open"
            );

          }
        );

      });
  }


  // Year
  if (el("year")) {

    el("year").textContent =
      new Date().getFullYear();

  }


  // Reveal animation
  const targets =
    document.querySelectorAll(
      ".section-heading, " +
      ".project-card, " +
      ".skill-group, " +
      ".timeline-item, " +
      ".research-card, " +
      ".lead"
    );


  targets.forEach(
    (target) =>
      target.classList.add(
        "reveal"
      )
  );


  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target
                  .classList.add(
                    "visible"
                  );

              }

            }
          );

        },
        {
          threshold: 0.08
        }
      );


    targets.forEach(
      (target) =>
        observer.observe(target)
    );

  } else {

    targets.forEach(
      (target) =>
        target.classList.add(
          "visible"
        )
    );

  }
}


// ---------- Start Portfolio ----------

(async function init() {

  try {

    const [
      site,
      projects,
      skills,
      teaching,
      research
    ] = await Promise.all([

      getJSON(
        "content/site.json",
        {}
      ),

      getJSON(
        "content/projects.json",
        []
      ),

      getJSON(
        "content/skills.json",
        []
      ),

      getJSON(
        "content/teaching.json",
        []
      ),

      getJSON(
        "content/research.json",
        []
      )

    ]);


    // The homepage can still work even
    // when optional sections are empty.

    renderSite(site);

    renderProjects(
      Array.isArray(projects)
        ? projects
        : []
    );

    renderSkills(
      Array.isArray(skills)
        ? skills
        : []
    );

    renderTeaching(
      Array.isArray(teaching)
        ? teaching
        : []
    );

    renderResearch(
      Array.isArray(research)
        ? research
        : []
    );


    setupInteractions();


    // Hide old error box
    if (el("loadError")) {

      el("loadError")
        .classList.add(
          "hidden"
        );

    }


  } catch (error) {

    console.error(
      "Portfolio initialization error:",
      error
    );


    // We intentionally do NOT destroy
    // the whole portfolio anymore.

    if (el("loadError")) {

      el("loadError")
        .classList.add(
          "hidden"
        );

    }


    setupInteractions();

  }

})();
