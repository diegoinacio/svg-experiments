// ! Include GitHub Corner
const GITHUB_CORNER = document.querySelector(".github-corner");
const CLASS = GITHUB_CORNER.className.split(" ");
const HREF = GITHUB_CORNER.getAttribute("href");

let title = CLASS[1] == "index" ? "Visit the repository" : "Source code";

GITHUB_CORNER.innerHTML = `
<svg viewbox="0 0 250 250">
  <a href="${HREF}" target="_blank">
    <title>${title}</title>
    <path d="M10 0h250v250"></path>
    <path class="octo-arm" d="M127.4 110c-14.6-9.2-9.4-19.5-9.4-19.5 3-7 1.5-11 1.5-11-1-6.2 3-2 3-2 4 4.7 2 11 2 11-2.2 10.4 5 14.8 9 16.2" fill="currentColor" style="transform-origin:130px 110px;"></path>
    <path class="octo-body" d="M113.2 114.3s3.6 1.6 4.7.6l15-13.7c3-2.4 6-3 8.2-2.7-8-11.2-14-25 3-41 4.7-4.4 10.6-6.4 16.2-6.4.6-1.6 3.6-7.3 11.8-10.7 0 0 4.5 2.7 6.8 16.5 4.3 2.7 8.3 6 12 9.8 3.3 3.5 6.7 8 8.6 12.3 14 3 16.8 8 16.8 8-3.4 8-9.4 11-11.4 11 0 5.8-2.3 11-7.5 15.5-16.4 16-30 9-40 .2 0 3-1 7-5.2 11l-13.3 11c-1 1 .5 5.3.8 5z" fill="currentColor"></path>
  </a>
</svg>
`;

// ! Include description box
window.addEventListener("DOMContentLoaded", () => {
  let description = document.querySelector(".description");
  let tbody = description.querySelector(":scope table tbody");

  let tr = document.createElement("tr");
  tr.innerHTML =
    "<td>🖥️</td> <td><em>Double-click</em> to toggle to <em>full screen</em>.</td>";
  tbody.appendChild(tr);

  let div = document.createElement("div");
  div.className = "top-tab";
  div.innerHTML = `<a href="#" class="close" title="Close description"></a>`;
  description.appendChild(div);

  setTimeout(() => {
    description.setAttribute("visible", "");
  }, 2000);

  description.querySelector(".close").addEventListener("click", (event) => {
    event.stopPropagation();
    description.removeAttribute("visible");
  });
});

// ! Include full screen event with double-click
function getFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullscreenElement ||
    document.msFullscreenElement
  );
}

function toggleFullscreen() {
  if (getFullscreenElement()) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

document.addEventListener("dblclick", () => {
  toggleFullscreen();
});
