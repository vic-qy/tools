// ==UserScript==
// @name         新标签页打开链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击任意链接自动在新标签页打开，不跳转当前页面
// @author       Your Name
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 监听整个文档的点击事件（事件委托）
    document.addEventListener('click', function(e) {
        // 找到被点击的链接元素（可能点击的是链接内的子元素，需要向上查找）
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }

        // 如果找到链接元素
        if (target && target.tagName === 'A') {
            const href = target.getAttribute('href');
            // 过滤无效链接和锚点链接
            if (href && href !== '#' && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
                // 阻止默认跳转行为
                e.preventDefault();
                e.stopPropagation();
                // 在新标签页打开链接
                window.open(href, '_blank');
            }
        }
    }, {
        capture: true, // 捕获阶段触发，确保优先于其他事件处理
        passive: false // 允许阻止默认行为
    });

    // 额外处理：防止部分网站通过mousedown事件提前拦截（可选）
    document.addEventListener('mousedown', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        if (target && target.tagName === 'A') {
            // 对于中键点击（滚轮点击），保持原生行为；左键强制新标签页
            if (e.button === 0) {
                target.setAttribute('target', '_blank');
            }
        }
    }, { capture: true });
})();