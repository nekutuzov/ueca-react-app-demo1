// Publishes dist/ to the gh-pages branch with the gh-pages package.
//
// "npm run deploy" builds first (the predeploy script) and then runs this. There is no working
// copy of the branch anywhere: gh-pages keeps its own clone and does the commit and push itself.

import { copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import ghpages from "gh-pages";

const DIST = "dist";

// gh-pages clones the branch into a cache directory, which defaults to node_modules/.cache - on
// this repository's drive. That drive is exFAT, which records no ownership, so git refuses to work
// in any repository on it ("detected dubious ownership") unless the path is listed in
// safe.directory. find-cache-dir honours CACHE_DIR, so point the cache at a filesystem that does
// record ownership and the clone is trusted without touching the machine's global git config.
process.env.CACHE_DIR ||= path.join(
    process.env.LOCALAPPDATA || os.tmpdir(),
    "ueca-react-app-demo1-deploy",
);

// GitHub Pages is a static host with no SPA fallback, so a direct request for /charts has no file
// to serve and returns GitHub's own 404 page - the app never loads and the router never gets a
// chance. Pages does serve 404.html for unmatched paths, and this app routes from window.location,
// so an identical copy of index.html makes deep links resolve.
copyFileSync(`${DIST}/index.html`, `${DIST}/404.html`);
console.log("404.html written for GitHub Pages deep links");

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const sha = git("rev-parse", "--short", "HEAD");
const subject = git("log", "-1", "--pretty=%s");
const dirty = git("status", "--porcelain") !== "";

if (dirty) {
    console.warn(`warning: the working tree has uncommitted changes, so this build is not exactly ${sha}`);
}

const message = `${subject} (build from ${sha}${dirty ? ", plus uncommitted changes" : ""})`;

console.log(`publishing ${DIST}/ to gh-pages via ${process.env.CACHE_DIR}`);
ghpages.publish(DIST, { message }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`published: ${message}`);
});
