function escapeHTML(string) {
    if (string === undefined) {
        return string;
    } else {
    string = string.replace("&", "&amp;");
    string = string.replace(">", "&gt;");
    string = string.replace("<", "&lt;");
    string = string.replace('"', "&quot;");
    string = string.replace("'", "&#039;");
    return string;
    }
}
