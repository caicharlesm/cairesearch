# Bioproducts from Biomass Refining — GitHub Pages package

This is the current Aalto research group website, including the team portraits,
selected publications and subtle scroll-controlled molecular animation. It is a
complete static site: no npm install, build service, database or GoDaddy web
hosting plan is required.

Prepared 6 October 2026 from website revision 93ef018.
Yellow hemicellulose beads are now about 91% of the main green cellulose bead diameter,
with spacing adjusted to keep the individual sugar beads visible.
The files are ready for both a GitHub project URL and a custom domain.

## What to upload

Upload the extracted contents of this package. The repository's publishing
folder must contain these files directly:

- `index.html` — page text and structure
- `styles.css` and `fonts.css` — layout and self-hosted fonts
- `app.js` — navigation, team/publication rendering and motion controls
- `content.js` — editable team, publications and future pilot-lab content
- `molecular.js` — the molecular background animation
- `assets/` — portraits, fonts and font licenses
- `.nojekyll` — tells GitHub to serve the static files without Jekyll
- `README.md` and `SOURCES.md` — setup guidance and public references

Keep file names and folder structure intact. Upload the extracted files, not the
ZIP itself. Do not place everything inside an extra folder in the repository.
No CNAME file is included because your real domain has not yet been supplied;
GitHub will create it when you save your custom domain.

## 1. Choose your repository

Open your GitHub website repository, or create a dedicated repository such as
`bioproducts-biomass-refining`. GitHub Free supports Pages for public repositories.
Pages from a private repository requires a supported paid plan. The published
research website will be publicly accessible.

The following steps use the `main` branch and repository root. If your existing
repository contains another project, you can instead put these website files
inside its `docs/` folder and select `/docs` as the publishing folder in step 3.
Keep unrelated project files intact.

## 2. Upload the website

1. Download and unzip this package on your computer.
2. In your repository's Code tab, select **Add file**, then **Upload files**.
   For a new empty repository, use its **uploading an existing file** link.
3. Drag the extracted contents into the upload area, including the whole
   `assets` folder so its subfolders are preserved.
4. Commit the upload to `main`. If GitHub requires a pull request, merge it so
   the files are present on `main`.
5. Confirm `index.html` and `assets/` appear directly in the publishing folder.
6. Confirm `.nojekyll` is present. It may be hidden by your computer's file
   browser. If missing, use **Add file → Create new file**, name it
   `.nojekyll`, add a blank line and commit it to the same publishing folder.

## 3. Turn on GitHub Pages

1. Open the repository's **Settings → Pages**.
2. In **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/(root)**. Use **/docs** only if you
   chose the existing-project option above.
4. Click **Save**. Allow up to 10 minutes for publication.
5. Use **Visit site** on the Pages settings screen. For an ordinary project
   repository, its initial address is
   `https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY/`.
   For a repository named exactly `YOUR-GITHUB-USERNAME.github.io`, the
   address is `https://YOUR-GITHUB-USERNAME.github.io/`.

Check that portraits and publications load, publication filters work, the
mobile menu opens, and the molecular background responds gently to scrolling.
The motion control can turn the animation off.

## 4. Connect your domain in GitHub first

Here `example.com` means your real GoDaddy domain; replace it everywhere.

Before adding it to the repository, GitHub recommends ownership verification:
use **account Settings → Pages → Add a domain** (or organization Settings → Pages).
GitHub supplies a DNS TXT name and value: add those exact values at GoDaddy,
return to GitHub and click **Verify**. Keep that TXT record. These are account
settings, distinct from the repository's Custom domain setting.

1. Return to the repository's **Settings → Pages**.
2. Under **Custom domain**, enter your domain without `https://` or a path:
   for example, `example.com`.
3. Click **Save** before changing DNS at GoDaddy.
4. GitHub adds a `CNAME` file containing your domain to the publishing folder.
   Keep this file when making future updates. An initial pending DNS check is
   expected until step 5 is completed.

## 5. Enter the DNS records at GoDaddy

1. Sign in to your GoDaddy **Domain Portfolio**.
2. Select your domain, then select **DNS**.
3. Use **Add New Record**, or edit an existing record for the same name.
4. Enter the following records. Use the default TTL, usually one hour.

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-GITHUB-USERNAME.github.io |

Replace `YOUR-GITHUB-USERNAME` with the account that owns the repository. For an
organization repository, use the organization name. The CNAME value contains
no `https://`, repository name or slash. GoDaddy's A-record form may offer
**Add another value** to enter the four IP addresses together.

Replace obsolete parking/website A records at `@` and edit an existing
`www` record rather than adding a conflicting one. Remove conflicting old
website AAAA records if present, or replace them with GitHub's IPv6 values
from its official custom-domain guide. Preserve unrelated email MX records
and TXT records. No domain forwarding rule is needed.

These GoDaddy controls apply when your domain uses GoDaddy nameservers. If
its DNS is hosted elsewhere, enter the records at that active DNS provider
without changing your nameservers merely to follow this guide.

## 6. Enable HTTPS and check the domain

DNS updates often work within an hour, but GoDaddy allows up to 48 hours for
global propagation. In GitHub **Settings → Pages**, wait for the domain check
to pass and enable **Enforce HTTPS** when available. GitHub provisions the
certificate automatically; the checkbox may take up to 24 hours to appear.

Visit both `https://example.com` and `https://www.example.com`.
With the bare domain selected in GitHub and the records above in place,
GitHub redirects the www address to the bare domain.

If there is a 404, first check that `index.html` is directly in the selected
publishing folder and that the Pages deployment succeeded in the Actions tab.
If the GitHub address works but the custom domain does not, check the domain
spelling and DNS records. If pictures are missing, check that `assets/` was
uploaded with its subfolders and original lower-case names.

## Updating the website later

- Edit team names, roles and portraits in `content.js`. Add new portraits to
  `assets/` and reference their relative paths in the team records.
- Add publication records to `content.js`. Supported filter categories are
  `Fractionation`, `Materials` and `Fuels`.
- Edit research wording and the group leader's biography in `index.html`.
- Adjust typography, spacing and colours in `styles.css`.
- The future CELF pilot-lab section is disabled in `content.js`. It can be
  enabled with an accurate public status, description and photo when ready.
- Commit changes to the publishing branch; GitHub Pages republishes them.
  Keep the domain's `CNAME` file and `.nojekyll` in place.
- When asking Codex for future changes, provide the repository URL and describe
  what should change. Keep GitHub as the main source once you start updating
  the exported version, so separate copies do not drift apart.

To preview locally, serve the extracted folder over HTTP, for example with
`python3 -m http.server 8000`, then open `http://localhost:8000/`.
Opening `index.html` directly from your file browser may block JavaScript
modules and does not provide a reliable preview.

## Official setup references

Checked 5 October 2026.

- [Upload files to GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Choose a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Configure a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verify domain ownership](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Enable HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [GoDaddy: add A records](https://www.godaddy.com/help/add-an-a-record-19238)
- [GoDaddy: add a CNAME record](https://www.godaddy.com/en/help/add-a-cname-record-19236)
