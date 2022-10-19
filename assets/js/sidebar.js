window.addEventListener('load', function () {
    const sidebar = this.document.getElementsByClassName('sidebar__right')[0];
    if (sidebar.clientHeight > 500) {
        sidebar.style.cssText = 'overflow-y: scroll; height: 500px;'
    }
});