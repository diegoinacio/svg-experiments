function renderSVG() {
  // ! File name
  const title = document.querySelector("title");
  let filename = title.innerText;
  filename = filename.toLowerCase().replace(/\s/g, "-");

  // ! SVG element
  const div = document.getElementById("svg-experiment");
  const svg = div.querySelector("svg");

  const serializer = new XMLSerializer();
  const svg_str = serializer.serializeToString(svg);

  // * Build url
  const DOM_url = self.URL || self.webkitURL || self;
  const svg_blob = new Blob([svg_str], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svg_url = DOM_url.createObjectURL(svg_blob);

  // ! Image element
  const image = new Image();

  image.onload = () => {
    // * Init canvas
    const canvas = document.createElement("canvas");

    canvas.setAttribute("width", svg.clientWidth);
    canvas.setAttribute("height", svg.clientHeight);

    // * Render to canvas
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    const png = canvas.toDataURL("image/png");

    // * Set download with dummy link
    const dummy = document.createElement("a");
    dummy.setAttribute("href", png);
    dummy.setAttribute("download", filename);
    dummy.click();
  };

  image.src = svg_url;
}
