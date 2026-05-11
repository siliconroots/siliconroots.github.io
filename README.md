# siliconroots.github.io

This repository is **already connected to GitHub** and published with **GitHub Pages** — the public marketing / landing site (`index.html`, assets). It is **not** the product application.

- **GitHub:** [github.com/siliconroots/siliconroots.github.io](https://github.com/siliconroots/siliconroots.github.io)
- **Live site:** [https://siliconroots.github.io](https://siliconroots.github.io) (default Pages URL for this repo name; confirm under **Settings → Pages** if you use a custom domain.)
- **Remote (example):** `git@github.com:siliconroots/siliconroots.github.io.git`
- **Deploy:** GitHub builds/serves from the branch and folder configured in **Settings → Pages** (commonly `main` + `/` root).

**Team workflow:** engineers work on the SaaS in separate repos (e.g. `siliconroots-backend`, `siliconroots-frontend`, `siliconroots-platform`). Changes to the **marketing site** only happen **here**, via PRs to this repo — keep Pages content and product code in different remotes so Pages stays simple and safe to publish.
