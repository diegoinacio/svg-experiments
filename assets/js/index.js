const DOMAIN = "diegoinacio.github.io";
const PROJECT = "svg-experiments";

// ! Build items
const section = document.querySelector(".section");
const ITEM = section.querySelectorAll(".item");

ITEM.forEach((item) => {
  // * Check if host is local or not to build image path
  // * If it is local, include relative path
  // * If it is not local, include absolute path
  const isLocal =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const url_path = isLocal
    ? `../../${item.id}`
    : `https://${DOMAIN}/${PROJECT}/${item.id}`;
  // * Create style variables
  item.style = `
    --bgi: url(${url_path}/thumb.jpg);
    --color: ${item.getAttribute("color")};
    --stroke: ${item.getAttribute("stroke")};
  `;
  // * Include item link
  item.innerHTML = `
    <a 
      href="${item.id}/"
      title="${item.getAttribute("title")}"
      target="_blank"
    ><h2>${item.getAttribute("name")}</h2></a>
  `;
});

// ! Build footer
const YEAR_FOOTER = new Date().getFullYear();

document.querySelector("footer#footer").innerHTML = `
  <p class="copyright">
    © ${YEAR_FOOTER} Diego Inácio. <br />
    <a href="https://${DOMAIN}/" target="_blank" title="my personal website">${DOMAIN}</a>
  </p>
`;
