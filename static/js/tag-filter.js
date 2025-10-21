document.addEventListener('DOMContentLoaded', () => {
  const tagFiltersContainer = document.getElementById('tag-filters');
  if (!tagFiltersContainer) {
    return;
  }

  const allCheckbox = tagFiltersContainer.querySelector('input[value="all"]');
  const tagCheckboxes = tagFiltersContainer.querySelectorAll('.tag-checkbox');
  const cards = document.querySelectorAll('.cards-grid > a[data-tags]');

  /**
   * 選択されたタグに基づいてカードをフィルタリングする関数
   */
  function filterCards() {
    const selectedTags = Array.from(tagCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value.toLowerCase());

    cards.forEach(card => {
      const cardTags = card.dataset.tags.split(' ');
      
      if (selectedTags.length === 0) {
        card.classList.remove('card-hidden');
      } else {
        const isMatch = selectedTags.every(tag => cardTags.includes(tag));
        
        if (isMatch) {
          card.classList.remove('card-hidden');
        } else {
          card.classList.add('card-hidden');
        }
      }
    });
  }

  /**
   * 「すべて」チェックボックスの処理
   */
  allCheckbox.addEventListener('change', () => {
    if (allCheckbox.checked) {
      tagCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }
    filterCards();
  });

  /**
   * 個別のタグチェックボックスの処理
   */
  tagCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (Array.from(tagCheckboxes).some(cb => cb.checked)) {
        allCheckbox.checked = false;
      } else {
        allCheckbox.checked = true;
      }
      filterCards();
    });
  });

  /**
   * ページ読み込み時にクエリパラメータをチェックし、指定されたタグにチェックを入れる
   */
  function checkTagsFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const tagsFromQuery = urlParams.get('tags');

    if (!tagsFromQuery) {
      return;
    }

    const tagsToCheck = tagsFromQuery.split(',').map(tag => tag.trim().toLowerCase());

    if (tagsToCheck.length > 0) {
      let isAnyTagChecked = false;
      tagCheckboxes.forEach(checkbox => {
        if (tagsToCheck.includes(checkbox.value.toLowerCase())) {
          checkbox.checked = true;
          isAnyTagChecked = true;
        }
      });

      if (isAnyTagChecked) {
        allCheckbox.checked = false;
        filterCards();
      }
    }
  }

  // ページ読み込み時に実行
  checkTagsFromQuery();
});