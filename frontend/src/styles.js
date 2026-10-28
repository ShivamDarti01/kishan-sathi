const styles = String.raw`@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap");

:root {
  font-family: "DM Sans", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif;
  color: #23332a;
  background: #f6f7f2;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --bg: #f6f7f2;
  --surface: #fff;
  --surface-soft: #fafbf8;
  --text: #23332a;
  --muted: #88948b;
  --line: #e9eee7;
  --green: #27794c;
  --green-dark: #1b5b39;
  --green-soft: #e9f4eb;
  --shadow: 0 8px 26px rgba(34, 60, 42, .045);
  --sidebar: 252px;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #141d18;
  --surface: #1d2922;
  --surface-soft: #202e26;
  --text: #e7eee8;
  --muted: #9aa99e;
  --line: #334138;
  --green: #6bc188;
  --green-dark: #b6e3c1;
  --green-soft: #263d2e;
  --shadow: 0 8px 26px rgba(0, 0, 0, .13);
}
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; background: var(--bg); color: var(--text); font-size: 14px; transition: background .2s, color .2s; }
button, input, select { font: inherit; }
button, a, select { -webkit-tap-highlight-color: transparent; }
a { color: inherit; text-decoration: none; }
button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible { outline: 3px solid #74b985; outline-offset: 3px; }
.app-shell { min-height: 100vh; }
.sidebar { position: fixed; inset: 0 auto 0 0; z-index: 20; width: var(--sidebar); padding: 27px 17px 17px; display: flex; flex-direction: column; background: var(--surface); border-right: 1px solid var(--line); }
.brand { display: flex; gap: 11px; align-items: center; padding: 0 10px; min-height: 42px; }
.brand-mark { width: 39px; height: 39px; display: grid; place-items: center; border-radius: 13px; color: white; background: linear-gradient(145deg, #38955b, #1d633d); box-shadow: 0 5px 13px #267e4c30; }
.brand strong { display: block; font: 800 14px "Manrope", sans-serif; letter-spacing: -.3px; }
.brand small { display: block; margin-top: 2px; color: var(--muted); font-size: 10px; }
.nav-caption { margin: 42px 10px 12px; color: #9ba69d; font-size: 9px; font-weight: 700; letter-spacing: 1.15px; }
.side-nav { display: grid; gap: 5px; }
.nav-link { height: 43px; display: flex; align-items: center; gap: 12px; padding: 0 12px; border-radius: 9px; color: #77847a; font-size: 12px; font-weight: 600; transition: .18s; }
.nav-link:hover { background: var(--surface-soft); color: var(--text); }
.nav-link.active { background: var(--green-soft); color: var(--green-dark); }
.nav-link.active svg { stroke-width: 2.2; }
.sidebar-bottom { margin-top: auto; }
.help-card { padding: 14px; border: 1px solid var(--line); border-radius: 13px; background: var(--surface-soft); }
.help-spark { display: block; margin-bottom: 7px; color: var(--green); font-size: 18px; }
.help-card strong { display: block; font-size: 11px; }
.help-card p { margin: 6px 0 10px; color: var(--muted); font-size: 10px; line-height: 1.6; }
.help-card a { color: var(--green); font-size: 10px; font-weight: 700; }
.profile-row { display: flex; align-items: center; gap: 9px; margin-top: 15px; padding: 12px 3px 0; border-top: 1px solid var(--line); }
.avatar, .top-avatar { display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%; color: #fff; background: #987e63; font-weight: 700; }
.avatar { width: 31px; height: 31px; font-size: 12px; }
.profile-text { min-width: 0; flex: 1; }
.profile-text strong, .profile-text small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.profile-text strong { font-size: 10px; }
.profile-text small { margin-top: 3px; color: var(--muted); font-size: 9px; }
.icon-button { display: inline-grid; place-items: center; padding: 0; width: 34px; height: 34px; border: 1px solid transparent; border-radius: 9px; background: transparent; color: #738178; cursor: pointer; transition: .16s; }
.icon-button:hover { border-color: var(--line); background: var(--surface-soft); color: var(--green); }
.main-area { min-height: 100vh; margin-left: var(--sidebar); display: flex; flex-direction: column; }
.topbar { position: sticky; top: 0; z-index: 10; height: 66px; padding: 0 clamp(22px, 4vw, 58px); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter: blur(14px); }
.breadcrumb { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 11px; }
.crumb-dot { color: #c1c9c1; }
.crumb-current { color: var(--text); font-weight: 600; }
.top-actions { display: flex; align-items: center; gap: 12px; }
.language-picker { position: relative; display: flex; align-items: center; gap: 4px; color: var(--muted); font-size: 10px; }
.language-picker span { margin-right: 2px; }
.language-picker select { appearance: none; padding: 6px 15px 6px 7px; border: 0; color: var(--text); background: transparent; font-size: 11px; cursor: pointer; }
.language-picker svg { position: absolute; right: 0; pointer-events: none; }
.top-avatar { width: 30px; height: 30px; font-size: 11px; }
.mobile-menu, .mobile-backdrop { display: none; }
.page-content { width: min(1120px, 100%); flex: 1; margin: 0 auto; padding: 32px clamp(22px, 4vw, 58px) 25px; }
.site-footer { display: flex; justify-content: space-between; gap: 15px; padding: 14px clamp(22px, 4vw, 58px) 18px; color: var(--muted); font-size: 9px; }
.site-footer a:hover { color: var(--green); }
.dashboard-page, .subpage { width: 100%; }
.welcome-row { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 22px; }
.eyebrow { display: flex; align-items: center; gap: 7px; color: var(--green); font-size: 9px; font-weight: 700; letter-spacing: 1.15px; }
.eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #63ad79; box-shadow: 0 0 0 3px #63ad791c; }
h1, h2, h3, p { margin-top: 0; }
.welcome-row h1, .page-intro h1, .result-heading h1 { margin: 9px 0 4px; font: 800 28px "Manrope", sans-serif; letter-spacing: -.9px; }
.welcome-row > div > p, .page-intro > p, .result-heading > p { margin: 0; color: var(--muted); font-size: 12px; }
.wave { display: inline-block; color: #79b987; font-size: 20px; }
.date-chip { display: flex; align-items: center; gap: 7px; padding: 8px 11px; border: 1px solid var(--line); border-radius: 8px; color: #78867c; background: var(--surface); font-size: 10px; }
.hero-card { position: relative; overflow: hidden; min-height: 213px; padding: 25px 31px; display: flex; align-items: center; border-radius: 16px; background: linear-gradient(106deg, #1c633e 0%, #277b4d 57%, #438a56 100%); color: #fff; box-shadow: 0 12px 24px #205e3d1c; }
.hero-card::after { position: absolute; right: 20%; top: -110px; width: 280px; height: 280px; border-radius: 50%; border: 1px solid #ffffff14; content: ""; box-shadow: 0 0 0 33px #ffffff08, 0 0 0 68px #ffffff06; }
.hero-copy { position: relative; z-index: 2; width: 58%; }
.hero-label { display: flex; align-items: center; gap: 6px; color: #c9e8d1; font-size: 8px; font-weight: 700; letter-spacing: 1px; }
.hero-copy h2 { margin: 10px 0 6px; font: 800 27px/1.16 "Manrope", sans-serif; letter-spacing: -.6px; }
.hero-copy p { max-width: 352px; margin: 0 0 15px; color: #d7ecdc; font-size: 10px; line-height: 1.55; }
.button { min-height: 36px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 13px; border: 0; border-radius: 8px; font-weight: 700; font-size: 10px; cursor: pointer; transition: transform .16s, box-shadow .16s, background .16s; }
.button:hover:not(:disabled) { transform: translateY(-1px); }
.button:disabled { opacity: .7; cursor: wait; }
.button-light { color: #205a3a; background: #fff; box-shadow: 0 4px 10px #123b2825; }
.button-light:hover { background: #eef6ee; }
.button-primary { color: #fff; background: #267848; box-shadow: 0 4px 11px #26784820; }
.button-primary:hover:not(:disabled) { background: #1c663c; box-shadow: 0 6px 14px #26784836; }
.button-outline { border: 1px solid var(--line); color: var(--text); background: var(--surface); }
.hero-art { position: absolute; right: 5%; bottom: -1px; width: 300px; height: 195px; }
.sun-disc { position: absolute; top: 13px; right: 48px; width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(140deg, #f8dd91, #eab766); box-shadow: 0 0 0 16px #f4d18c13; }
.plant-ground { position: absolute; right: 0; bottom: 0; width: 256px; height: 58px; border-radius: 60% 48% 0 0; background: linear-gradient(160deg, #8db374, #56794e); transform: rotate(-2deg); }
.plant-stem { position: absolute; right: 121px; bottom: 30px; z-index: 2; width: 6px; height: 116px; border-radius: 6px; background: #c0d29a; transform: rotate(4deg); transform-origin: bottom; }
.plant-leaf { position: absolute; z-index: 3; width: 70px; height: 36px; border-radius: 90% 8% 90% 8%; background: linear-gradient(145deg, #b3d58b, #5ca36a); box-shadow: inset 0 1px #ffffff53; }
.leaf-one { right: 125px; bottom: 111px; transform: rotate(7deg); }
.leaf-two { right: 61px; bottom: 97px; transform: rotate(-42deg) scaleX(-1); }
.leaf-three { right: 135px; bottom: 69px; transform: rotate(27deg) scale(.8); }
.leaf-four { right: 74px; bottom: 53px; transform: rotate(-30deg) scale(.68, .8); }
.art-spark { position: absolute; z-index: 3; color: #f1d791; }
.spark-one { top: 34px; left: 40px; font-size: 18px; }
.spark-two { top: 93px; right: 10px; font-size: 14px; }
.model-notice { display: flex; align-items: flex-start; gap: 12px; margin: 17px 0; padding: 14px 16px; border: 1px solid #ecdfbd; border-radius: 11px; color: #6e5730; background: #fcf8ed; }
:root[data-theme="dark"] .model-notice { border-color: #675632; color: #e2c98e; background: #332d20; }
.notice-icon { display: grid; place-items: center; flex: 0 0 auto; width: 30px; height: 30px; border-radius: 9px; color: #a07b32; background: #f3e8c9; }
:root[data-theme="dark"] .notice-icon { background: #4a3e26; color: #e2c98e; }
.model-notice strong { font-size: 11px; }
.model-notice p { margin: 3px 0 0; font-size: 10px; line-height: 1.6; }
.model-notice.compact { padding: 10px 12px; margin: 13px 0; }
.model-notice.compact .notice-icon { width: 26px; height: 26px; }
.notice-foot { display: flex; align-items: center; gap: 5px; margin-top: 7px; color: #8e7547; font-size: 9px; }
.stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; margin: 13px 0; }
.stat-card { min-height: 119px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow); }
.stat-icon { width: 31px; height: 31px; display: grid; place-items: center; margin-bottom: 10px; border-radius: 9px; }
.stat-icon.green { color: #338253; background: #e8f4eb; }
.stat-icon.mint { color: #4b9a75; background: #e8f5ef; }
.stat-icon.amber { color: #ad8950; background: #f8f0df; }
.stat-label { color: var(--muted); font-size: 10px; }
.stat-value { display: inline-block; margin: 2px 6px 0 0; font: 800 21px "Manrope", sans-serif; }
.stat-foot { display: inline; color: var(--muted); font-size: 9px; }
.content-grid { display: grid; grid-template-columns: 1.55fr 1fr; gap: 13px; margin-top: 13px; }
.panel { border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow); }
.trend-panel, .tips-panel, .recent-panel { padding: 17px 18px; }
.panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.panel-heading h3 { margin: 0; font: 700 13px "Manrope", sans-serif; letter-spacing: -.2px; }
.panel-heading p { margin: 4px 0 0; color: var(--muted); font-size: 9px; }
.chart-period { display: inline-flex; align-items: center; gap: 5px; padding: 6px 8px; border: 1px solid var(--line); border-radius: 7px; color: var(--muted); font-size: 9px; white-space: nowrap; }
.chart-wrap { width: 100%; height: 155px; margin-top: 10px; }
.chart-legend { display: flex; align-items: center; gap: 6px; margin-top: 3px; color: var(--muted); font-size: 9px; }
.chart-legend span { width: 7px; height: 7px; border-radius: 50%; background: var(--green); }
.skeleton-chart { height: 100%; border-radius: 8px; background: linear-gradient(100deg, var(--surface-soft) 25%, var(--line) 45%, var(--surface-soft) 65%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.analytics-grid { margin-top: 13px; }
.distribution-chart { height: 165px; margin-top: 4px; }
.crop-chart { height: 190px; margin-top: 4px; }
.distribution-legend { display: flex; flex-wrap: wrap; gap: 7px 12px; }
.distribution-legend span { display: inline-flex; align-items: center; gap: 5px; max-width: 48%; overflow: hidden; color: var(--muted); font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }
.distribution-legend i { width: 7px; height: 7px; flex: 0 0 auto; border-radius: 50%; }
.distribution-legend b { color: var(--text); }
.chart-empty { min-height: 165px; display: grid; place-items: center; padding: 18px; color: var(--muted); font-size: 9px; line-height: 1.6; text-align: center; }
.tip-icon { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 10px; color: var(--green); background: var(--green-soft); }
.tip-item { display: flex; gap: 10px; margin-top: 17px; }
.tip-number { color: #87b58f; font: 700 10px "Manrope", sans-serif; }
.tip-item strong { display: block; font-size: 10px; }
.tip-item p { margin: 3px 0 0; color: var(--muted); font-size: 9px; line-height: 1.55; }
.recent-panel { margin-top: 13px; }
.recent-panel .panel-heading { margin-bottom: 11px; align-items: center; }
.text-link { display: inline-flex; align-items: center; gap: 4px; color: var(--green); font-size: 9px; font-weight: 700; }
.scan-list { display: grid; }
.scan-row { min-height: 55px; display: flex; align-items: center; gap: 10px; border-top: 1px solid var(--line); transition: background .15s; }
.scan-row:hover { background: var(--surface-soft); }
.scan-row-main { min-width: 0; min-height: 54px; flex: 1; display: flex; align-items: center; gap: 10px; }
.delete-scan { width: 30px; height: 30px; display: grid; flex: 0 0 auto; place-items: center; border: 0; border-radius: 7px; color: var(--muted); background: transparent; cursor: pointer; }
.delete-scan:hover { color: #a6463b; background: #fff0ed; }
.scan-crop-icon { width: 31px; height: 31px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 9px; color: #b08038; background: #f7f0e2; }
.scan-crop-icon.healthy-icon { color: var(--green); background: var(--green-soft); }
.scan-info { min-width: 0; flex: 1; }
.scan-info strong, .scan-info span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.scan-info strong { font-size: 10px; }
.scan-info span { margin-top: 3px; color: var(--muted); font-size: 9px; text-transform: capitalize; }
.scan-confidence { color: var(--green); font-size: 10px; font-weight: 700; }
.scan-arrow { color: #a5b0a7; }
.empty-state { padding: 24px 12px; text-align: center; }
.empty-icon { width: 40px; height: 40px; display: grid; place-items: center; margin: 0 auto 10px; border-radius: 13px; color: var(--green); background: var(--green-soft); }
.empty-state strong { display: block; font-size: 11px; }
.empty-state p { margin: 5px 0 9px; color: var(--muted); font-size: 9px; }
.loading-row { padding: 22px; color: var(--muted); font-size: 11px; text-align: center; }
.subpage { max-width: 925px; margin: 0 auto; }
.page-intro { margin: 3px 0 20px; }
.page-intro h1 { font-size: 27px; }
.scanner-layout { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(225px, .8fr); gap: 15px; align-items: start; }
.scanner-form { padding: 20px; }
.scan-step { color: var(--green); font: 700 12px "Manrope", sans-serif; }
.scan-step span { color: var(--muted); font-weight: 500; }
.upload-zone { width: 100%; min-height: 195px; margin: 18px 0 17px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed #bbd2bd; border-radius: 11px; color: var(--text); background: var(--surface-soft); cursor: pointer; transition: .18s; }
.upload-zone:hover { border-color: var(--green); background: var(--green-soft); }
.upload-icon { width: 43px; height: 43px; display: grid; place-items: center; margin-bottom: 9px; border-radius: 13px; color: var(--green); background: var(--green-soft); }
.upload-zone strong { font-size: 11px; }
.upload-zone > span:not(.upload-icon) { margin-top: 4px; color: var(--muted); font-size: 9px; }
.upload-zone small { margin-top: 11px; color: #aab4ab; font-size: 8px; letter-spacing: 1px; }
.preview-wrap { position: relative; overflow: hidden; height: 240px; margin: 18px 0 17px; border-radius: 10px; background: #ecf1ea; }
.preview-wrap > img { width: 100%; height: 100%; object-fit: contain; }
.preview-overlay { position: absolute; inset: 8px 8px auto; display: flex; justify-content: space-between; align-items: center; }
.preview-overlay > span { display: inline-flex; align-items: center; gap: 5px; padding: 6px 8px; border-radius: 6px; color: #235d38; background: #ffffffed; font-size: 9px; font-weight: 700; }
.remove-image { width: 28px; height: 28px; display: grid; place-items: center; border: 0; border-radius: 50%; color: #fff; background: #22372bba; cursor: pointer; }
.change-image { position: absolute; right: 9px; bottom: 9px; display: flex; align-items: center; gap: 5px; padding: 7px 9px; border: 0; border-radius: 6px; color: var(--text); background: var(--surface); font-size: 9px; cursor: pointer; }
.field-label { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 7px; font-size: 10px; font-weight: 700; }
.field-label span { color: var(--muted); font-size: 9px; font-weight: 400; }
.form-select, .form-field input { width: 100%; height: 39px; padding: 0 11px; border: 1px solid var(--line); border-radius: 8px; color: var(--text); background: var(--surface); font-size: 10px; }
.analyze-button { width: 100%; height: 40px; margin-top: 15px; }
.spinner { width: 14px; height: 14px; border: 2px solid #ffffff66; border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
.form-error, .form-success { display: flex; align-items: center; gap: 7px; margin-top: 12px; padding: 9px 10px; border-radius: 8px; color: #9e3f36; background: #fff0ed; font-size: 10px; line-height: 1.45; }
:root[data-theme="dark"] .form-error { color: #ffb3a9; background: #412925; }
.form-success { color: #236742; background: #e8f4eb; }
.auth-hint { display: flex; align-items: center; justify-content: center; gap: 5px; margin: 11px 0 0; color: var(--muted); font-size: 9px; }
.scanner-aside { display: grid; gap: 12px; }
.guide-panel { padding: 16px; }
.guide-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px; color: var(--green); background: var(--green-soft); }
.guide-panel h3 { margin: 11px 0 9px; font: 700 12px "Manrope", sans-serif; }
.guide-panel ul { margin: 0; padding: 0 0 0 15px; color: var(--muted); font-size: 9px; line-height: 1.65; }
.guide-panel li { margin: 7px 0; padding-left: 2px; }
.guide-panel li::marker { color: var(--green); }
.privacy-note { display: flex; gap: 9px; padding: 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); }
.privacy-icon { color: var(--green); }
.privacy-note p { margin: 0; color: var(--muted); font-size: 9px; line-height: 1.6; }
.privacy-note strong { color: var(--text); }
.inline-error { padding: 10px 12px; border: 1px solid #ecc8c1; border-radius: 8px; color: #984338; background: #fff4f1; font-size: 10px; }
.history-panel { padding: 17px; }
.history-toolbar { display: flex; gap: 9px; margin-bottom: 12px; }
.search-field, .filter-field { height: 35px; display: flex; align-items: center; gap: 7px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; color: var(--muted); background: var(--surface); }
.search-field { flex: 1; }
.search-field input { width: 100%; border: 0; outline: 0; color: var(--text); background: transparent; font-size: 10px; }
.filter-field select { border: 0; outline: 0; color: var(--text); background: transparent; font-size: 9px; cursor: pointer; }
.result-actions { display: flex; justify-content: space-between; align-items: center; margin: 0 0 17px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: 10px; }
.back-link:hover { color: var(--green); }
.print-button { min-height: 32px; font-size: 9px; }
.result-heading { margin-bottom: 17px; }
.result-heading h1 { font-size: 26px; }
.result-grid { display: grid; grid-template-columns: 1fr 1.15fr; gap: 13px; }
.result-image-panel { overflow: hidden; }
.result-image-panel > img, .result-placeholder { display: block; width: 100%; height: 265px; object-fit: contain; background: var(--surface-soft); }
.result-placeholder { display: grid; place-items: center; color: #92ae96; }
.result-image-caption { min-height: 37px; display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 0 12px; color: var(--muted); font-size: 9px; }
.result-image-caption span:first-child { display: flex; align-items: center; gap: 5px; color: var(--text); text-transform: capitalize; }
.diagnosis-panel { padding: 19px; }
.diagnosis-badge { display: inline-flex; align-items: center; gap: 5px; padding: 6px 8px; border-radius: 6px; color: #946d28; background: #f8f1e0; font-size: 8px; font-weight: 700; }
.healthy-badge { color: var(--green); background: var(--green-soft); }
.diagnosis-panel h2 { margin: 12px 0 17px; font: 800 19px "Manrope", sans-serif; letter-spacing: -.4px; }
.confidence-line { display: flex; justify-content: space-between; color: var(--muted); font-size: 9px; }
.confidence-line strong { color: var(--text); font-size: 11px; }
.confidence-track { overflow: hidden; height: 6px; margin-top: 7px; border-radius: 8px; background: var(--line); }
.confidence-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #72b884, #267848); }
.uncertainty-banner { display: flex; gap: 7px; margin-top: 13px; padding: 9px; border-radius: 7px; color: #8a6525; background: #fbf4e3; font-size: 9px; line-height: 1.5; }
.diagnosis-disclaimer { margin: 13px 0 0; color: var(--muted); font-size: 9px; line-height: 1.5; }
.alternatives { margin-top: 15px; padding-top: 13px; border-top: 1px solid var(--line); }
.alternatives h3 { margin: 0 0 8px; font-size: 10px; }
.alternative-row { display: flex; justify-content: space-between; padding: 5px 0; color: var(--muted); font-size: 9px; }
.alternative-row strong { color: var(--text); }
.result-note { display: flex; gap: 11px; margin-top: 13px; padding: 13px; border: 1px solid var(--line); border-radius: 11px; background: var(--surface); }
.result-note .tip-icon { flex: 0 0 auto; }
.result-note strong { display: block; font-size: 10px; }
.result-note p { margin: 4px 0 0; color: var(--muted); font-size: 9px; line-height: 1.6; }
.result-guidance { margin-top: 13px; padding: 16px; }
.guidance-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 13px; }
.guidance-grid > div { padding: 11px; border-radius: 8px; background: var(--surface-soft); }
.guidance-grid strong { font-size: 9px; }
.guidance-grid p { margin: 5px 0 0; color: var(--muted); font-size: 9px; line-height: 1.6; }
.result-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; color: var(--muted); font-size: 9px; }
.library-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 13px; }
.disease-card { padding: 17px; }
.disease-icon { display: inline-grid; place-items: center; width: 33px; height: 33px; border-radius: 10px; color: var(--green); background: var(--green-soft); }
.disease-crop { float: right; padding: 5px 7px; border-radius: 5px; color: var(--muted); background: var(--surface-soft); font-size: 8px; text-transform: capitalize; }
.disease-card h3 { margin: 10px 0 5px; font: 700 13px "Manrope", sans-serif; }
.disease-card > p { margin: 0; color: var(--muted); font-size: 9px; line-height: 1.6; }
.disease-detail { display: grid; gap: 10px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); }
.disease-detail > div { display: flex; align-items: flex-start; gap: 7px; color: var(--green); }
.disease-detail span { color: var(--muted); font-size: 9px; line-height: 1.5; }
.disease-detail strong { display: block; margin-bottom: 2px; color: var(--text); font-size: 9px; }
.disease-card .source-note { margin-top: 12px; font-size: 8px; }
.help-layout { display: grid; grid-template-columns: 1.5fr .8fr; align-items: start; gap: 13px; }
.faq-panel { padding: 17px; }
.muted-icon { color: var(--muted); }
.faq-item { border-top: 1px solid var(--line); }
.faq-item:first-of-type { margin-top: 14px; }
.faq-item summary { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 12px 0; list-style: none; cursor: pointer; font-size: 10px; font-weight: 600; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary svg { flex: 0 0 auto; color: var(--muted); transition: transform .2s; }
.faq-item[open] summary svg { transform: rotate(180deg); }
.faq-item p { margin: -2px 20px 12px 0; color: var(--muted); font-size: 9px; line-height: 1.65; }
.support-card { padding: 18px; }
.support-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; color: var(--green); background: var(--green-soft); }
.support-card h3 { margin: 13px 0 6px; font: 700 13px "Manrope", sans-serif; }
.support-card p { color: var(--muted); font-size: 9px; line-height: 1.65; }
.support-link { display: inline-flex; align-items: center; gap: 5px; color: var(--green); font-size: 9px; font-weight: 700; }
.about-panel { max-width: 700px; padding: 25px; }
.about-mark { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 15px; color: var(--green); background: var(--green-soft); }
.about-panel h2 { max-width: 460px; margin: 17px 0 8px; font: 800 23px "Manrope", sans-serif; letter-spacing: -.6px; }
.about-panel > p { max-width: 600px; color: var(--muted); font-size: 11px; line-height: 1.75; }
.about-values { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--line); }
.about-values > div { display: grid; grid-template-columns: 25px 1fr; align-items: center; color: var(--green); }
.about-values strong { color: var(--text); font-size: 10px; }
.about-values span { grid-column: 2; margin-top: 3px; color: var(--muted); font-size: 9px; line-height: 1.55; }
.auth-page { min-height: calc(100vh - 105px); display: grid; place-items: center; }
.auth-card { width: min(390px, 100%); padding: 27px; border: 1px solid var(--line); border-radius: 15px; background: var(--surface); box-shadow: var(--shadow); }
.auth-brand { padding: 0; }
.auth-heading { margin: 27px 0 18px; }
.auth-lock { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 11px; color: var(--green); background: var(--green-soft); }
.auth-heading h1 { margin: 12px 0 5px; font: 800 21px "Manrope", sans-serif; }
.auth-heading p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.5; }
.auth-form { display: grid; gap: 12px; }
.form-field { display: grid; gap: 6px; }
.form-field > span { font-size: 10px; font-weight: 600; }
.form-field input { height: 39px; }
.auth-submit { height: 40px; margin-top: 3px; }
.auth-switch { margin: 16px 0 0; color: var(--muted); font-size: 9px; text-align: center; }
.auth-switch a { margin-left: 3px; color: var(--green); font-weight: 700; }
.auth-side { display: none; }
.sr-only { position: absolute; overflow: hidden; width: 1px; height: 1px; padding: 0; margin: -1px; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
@media (min-width: 1200px) { :root { --sidebar: 265px; } }
@media (max-width: 900px) { :root { --sidebar: 220px; } .hero-art { right: 0; opacity: .85; transform: scale(.88); transform-origin: right bottom; } .page-content { padding-right: 25px; padding-left: 25px; } .content-grid { grid-template-columns: 1.2fr 1fr; } }
@media (max-width: 700px) {
  :root { --sidebar: 255px; }
  .sidebar { transform: translateX(-105%); transition: transform .22s ease; box-shadow: 14px 0 32px #00000012; }
  .sidebar.sidebar-open { transform: translateX(0); }
  .mobile-backdrop { position: fixed; inset: 0; z-index: 19; display: block; border: 0; background: #101b1473; }
  .main-area { margin-left: 0; }
  .topbar { height: 58px; padding: 0 16px; }
  .mobile-menu { display: inline-grid; }
  .breadcrumb { margin-right: auto; margin-left: 6px; font-size: 10px; }
  .top-actions { gap: 6px; }
  .language-picker > span { display: none; }
  .theme-toggle { width: 31px; }
  .top-avatar { display: none; }
  .page-content { padding: 24px 16px 20px; }
  .site-footer { padding: 12px 16px 16px; font-size: 8px; }
  .welcome-row { align-items: flex-start; }
  .welcome-row h1 { font-size: 24px; }
  .welcome-row > div > p { max-width: 270px; line-height: 1.5; }
  .date-chip { font-size: 0; padding: 8px; }
  .date-chip svg { width: 16px; height: 16px; }
  .hero-card { min-height: 210px; padding: 20px; }
  .hero-copy { width: 75%; }
  .hero-copy h2 { font-size: 23px; }
  .hero-copy p { max-width: 270px; font-size: 9px; }
  .hero-art { right: -68px; opacity: .57; transform: scale(.75); }
  .hero-card::after { right: 4%; }
  .stat-grid { gap: 8px; }
  .stat-card { min-height: 111px; padding: 11px; }
  .stat-icon { width: 28px; height: 28px; margin-bottom: 8px; }
  .stat-label { font-size: 9px; }
  .stat-value { font-size: 19px; }
  .stat-foot { display: block; margin-top: 2px; font-size: 8px; }
  .content-grid { grid-template-columns: 1fr; }
  .chart-wrap { height: 175px; }
  .tips-panel { display: grid; grid-template-columns: 1fr 1fr; column-gap: 12px; }
  .tips-panel .panel-heading { grid-column: 1 / -1; }
  .tip-item { margin-top: 15px; }
  .scanner-layout, .result-grid, .help-layout { grid-template-columns: 1fr; }
  .scanner-aside { grid-template-columns: 1fr 1fr; }
  .page-intro h1 { font-size: 24px; }
  .library-grid { gap: 9px; }
  .disease-card { padding: 13px; }
}
@media (max-width: 440px) {
  .breadcrumb > span:first-child, .crumb-dot { display: none; }
  .breadcrumb { margin-left: 8px; }
  .hero-copy { width: 88%; }
  .hero-art { right: -106px; opacity: .43; }
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .stat-card:last-child { grid-column: 1 / -1; min-height: 92px; }
  .stat-card:last-child .stat-icon { float: left; margin: 0 10px 0 0; }
  .stat-card:last-child .stat-label { padding-top: 1px; }
  .stat-card:last-child .stat-value { margin-top: 4px; }
  .stat-card:last-child .stat-foot { margin-left: 3px; }
  .scanner-aside { grid-template-columns: 1fr; }
  .library-grid { grid-template-columns: 1fr; }
  .guidance-grid { grid-template-columns: 1fr; }
  .result-footer { align-items: flex-start; flex-direction: column; }
  .result-footer .button { align-self: stretch; }
  .about-values { grid-template-columns: 1fr; }
  .site-footer { flex-wrap: wrap; }
}
@media print {
  .sidebar, .topbar, .site-footer, .result-actions, .result-footer .button { display: none !important; }
  .main-area { margin: 0; }
  .page-content { width: 100%; padding: 0; }
  .panel { box-shadow: none; break-inside: avoid; }
  .result-page { max-width: none; }
}
`;

const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.append(styleElement);

