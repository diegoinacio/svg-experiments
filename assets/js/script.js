// ! Util functionalities
window.mobileCheck = function () {
  // ? From http://detectmobilebrowsers.com/
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

// ! Document functionalities
window.addEventListener("DOMContentLoaded", () => {
  // * Include Return Corner
  const RETURN_CORNER = document.querySelector(".return-corner");
  if (RETURN_CORNER) {
    const HREF_RC = "https://diegoinacio.github.io/svg-experiments/";

    RETURN_CORNER.innerHTML = `
      <svg viewbox="0 0 250 250">
        <a href="${HREF_RC}" target="_blank">
          <title>Return to SVG Experiments</title>
          <circle class="bg" cx="125" cy="125" r="115" />
          <polyline class="arrow" points="146.5 62.5 83.5 125 146 187.5" />
        </a>
      </svg>
    `;
  }

  // * Include GitHub Corner
  const GITHUB_CORNER = document.querySelector(".github-corner");
  if (GITHUB_CORNER) {
    const CLASS_GC = GITHUB_CORNER.className.split(" ");
    const HREF_GC = GITHUB_CORNER.getAttribute("href");

    let title = CLASS_GC[1] == "index" ? "Visit the repository" : "Source code";

    GITHUB_CORNER.innerHTML = `
      <svg viewbox="0 0 250 250">
        <a href="${HREF_GC}" target="_blank">
          <title>${title}</title>
          <circle class="bg" cx="125" cy="125" r="115" />
          <g transform="translate(10 10)">
            <path class="octo-arm" d="M99.89,213.43c-32.73,7.42-39.74-13.89-39.74-13.89-5.5-13.75-13.07-17.19-13.07-17.19-9.9-7.15,1.38-6.87,1.38-6.87,12,1,17.87,12.37,17.87,12.37,11.28,17.33,27.23,13.48,34.66,9.9" fill="currentColor" style="transform-origin:90px 200px;"></path>
            <path class="octo-body" d="M85.42,240s7.15-2.75,7.29-5.64L94.5,194.9c.82-7.43,4.12-12.38,7.56-15-26.4-4.4-53.63-15.12-52.25-60.5A46,46,0,0,1,63.28,88.33c-1.37-3-5.08-15,1.52-30.93,0,0,9.9-2.48,32,13.33a126.59,126.59,0,0,1,30-3c9.35.27,20.21,1.79,28.74,5.09,23.37-15.13,34.1-12.1,34.1-12.1,6.32,15.67,2.2,28.05-.55,30.8,8,8,12,18.29,11,31.62-.55,44.55-28.88,53.63-54.73,55.28,4.13,4.12,8.25,11,8,22.27l-3.16,33.42c0,2.75,8,6.6,8,5.77Z" transform="translate(-10 -10)" fill="currentColor"></path>
          </g>
        </a>
      </svg>
    `;
  }

  // * Include description box
  let description = document.querySelector(".description");
  let tbody = description.querySelector(":scope table tbody");

  if (!window.mobileAndTabletCheck()) {
    // * Include full screen messa for non-mobile
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>🖥️</td> <td><em class="command">Press <b>F11</b></em> to toggle to <em>full screen</em>.</td>`;
    tbody.appendChild(tr);
  }

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
