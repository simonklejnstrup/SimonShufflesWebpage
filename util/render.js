import fs from "fs"

const nav = fs.readFileSync("./public/components/nav/nav.html", "utf8");
const footer = fs.readFileSync("./public/components/footer/footer.html", "utf8");



export function createPage(path, options) {
    return (nav + fs.readFileSync(`./public/pages/${path}`, "utf8") + footer)
            .replace("%%DOCUMENT_TITLE%%", options?.title || "Simon Shuffles")
            .replace("%%CSS_PLACEHOLDER%%", options?.cssTag || "")
            .replace("%%SCRIPT_PLACEHOLDER%%", options?.scriptTag || "")



}