// ==UserScript==
// @name            Wikipedia - Highlight language
// @match           https://en.wikipedia.org/wiki/*
// @match           https://fr.wikipedia.org/wiki/*
// @match           https://en.wiktionary.org/wiki/*
// @match           https://fr.wiktionary.org/wiki/*
// @version         1.0
// ==/UserScript==

(function() {
    const targetLang = location.hostname.startsWith('fr.') ? 'en' : 'fr';

    function highlightLanguage(list) {
        window.setTimeout(() => {
            const link = list.querySelector(`a[lang="${targetLang}"]`);
            if (!link) return;
            const item = link.closest('li') ?? link.parentElement;
            item.style.cssText += 'background:#ffe066;border-radius:4px;';
            item.parentElement.prepend(item);
        }, 100);
    }

    function observeList() {
        const existing = document.querySelector('.row.uls-language-list.uls-lcd');
        if (existing) {
            highlightLanguage(existing);
            return;
        }
        const observer = new MutationObserver((mutations, obs) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof Element)) continue;
                    const list = node.classList.contains('uls-language-list') ?
                        node :
                        node.querySelector('.row.uls-language-list.uls-lcd');
                    if (list) {
                        highlightLanguage(list);
                        obs.disconnect();
                        return;
                    }
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    const checkbox = document.getElementById('p-lang-btn-checkbox');
    if (checkbox) {
        checkbox.addEventListener('click', observeList, {
            once: true
        });
    }
})();