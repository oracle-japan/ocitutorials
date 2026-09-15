(() => {
  "use strict";

  // 本文の画像のみを対象
  const images = [...document.querySelectorAll(".gdoc-markdown img")]
    .filter((img) =>
      !img.closest('a, button, [role="button"], [data-no-zoom]') &&
      img.getAttribute("aria-hidden") !== "true"
    );

  if (images.length === 0) return;

  const dialog = document.createElement("dialog");

  // 未対応ブラウザでは、通常の画像表示を維持
  if (typeof dialog.showModal !== "function") return;

  dialog.id = "oci-image-zoom";
  dialog.setAttribute("aria-label", "画像の拡大表示");

  const enlargedImage = document.createElement("img");

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "oci-image-zoom-close";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "拡大表示を閉じる");
  closeButton.autofocus = true;

  dialog.append(closeButton, enlargedImage);
  document.body.appendChild(dialog);

  let sourceImage = null;

  function openImage(img) {
    if (dialog.open) return;

    sourceImage = img;
    enlargedImage.alt = img.alt || "";
    enlargedImage.src = img.currentSrc || img.src;

    dialog.showModal();
    document.documentElement.classList.add("oci-image-zoom-open");
  }

  // 閉じるボタン、拡大画像、背景のクリックで閉じる。
  dialog.addEventListener("click", (event) => {
    if (
      event.target === closeButton ||
      event.target === enlargedImage ||
      event.target === dialog
    ) {
      dialog.close();
    }
  });

  // Escキーで閉じた場合も、ここで共通の後処理を行う。
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("oci-image-zoom-open");
    enlargedImage.removeAttribute("src");

    if (sourceImage?.isConnected) {
      sourceImage.focus({ preventScroll: true });
    }
    sourceImage = null;
  });

  images.forEach((img) => {
    img.classList.add("oci-image-zoom-target");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-haspopup", "dialog");
    img.setAttribute(
      "aria-label",
      img.alt ? `${img.alt}を拡大表示` : "画像を拡大表示"
    );

    img.addEventListener("click", () => openImage(img));

    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImage(img);
      }
    });
  });
})();