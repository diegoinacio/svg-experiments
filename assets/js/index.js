const DOMAIN = "diegoinacio.github.io";
const PROJECT = "svg-experiments";

// ! Build items
const items = document.querySelector(".items");

import { INDEX } from "../../metadata.mjs";

INDEX.forEach((item) => {
  const div = document.createElement("div");
  div.id = item.id;
  div.className = "item";

  // * Check if host is local or not to build image path
  // * If it is local, include relative path
  // * If it is not local, include absolute path
  const isLocal =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const url_path = isLocal
    ? `../../${item.id}`
    : `https://${DOMAIN}/${PROJECT}/${item.id}`;

  // * Create style variables
  div.style = `
    --bgi: url(${url_path}/thumb.jpg);
    --color: ${item.color};
    --stroke: ${item.stroke};
  `;

  // * Include item link
  div.innerHTML = `
    <a
      href="${item.id}/"
      title="${item.title}"
      target="_blank"
    ><h2>${item.name}</h2></a>
  `;
  items.appendChild(div);
});

// ! Build footer
const YEAR_FOOTER = new Date().getFullYear();

document.querySelector("footer#footer").innerHTML = `
  <p class="signature">
    Made with ❤️ by
    <a href="https://${DOMAIN}/" target="_blank" title="personal website">Diego Inácio</a>
  </p>
  <p class="copyright">
    © ${YEAR_FOOTER} Diego Inácio. <br />
  </p>
`;

// ! Build Ko-fi button
const kofi_button = document.getElementById("kofi-button-container");
kofiwidget2.init("Support this project", "#000", "K3K3GHK2Z");
kofi_button.innerHTML = kofiwidget2.getHTML();

// * close button
const kofi_button_x = document.createElement("span");
kofi_button_x.id = "close";
kofi_button.appendChild(kofi_button_x);
kofi_button_x.innerText = "x";

kofi_button_x.addEventListener("click", () => {
  kofi_button.style.display = "none";
});
