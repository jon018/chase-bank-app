* { box-sizing: border-box; }

:root {
  --navy-900: #061d42;
  --navy-800: #0a2b5d;
  --navy-700: #123872;
  --grey-50: #f5f6f8;
  --grey-100: #eef1f4;
  --grey-200: #dfe5ea;
  --grey-300: #cfd7df;
  --grey-500: #778397;
  --grey-700: #3d4654;
  --ink: #111827;
  --white: #ffffff;
  --pink: #f8dfe0;
  --pink-text: #b35d62;
  --success: #1b8d56;
  --warning: #f59e0b;
  --danger: #d63f3f;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  height: 100%;
  font-family: 'Inter', sans-serif;
  background: #eceef1;
  color: var(--ink);
}

body {
  min-height: 100vh;
}

button, input, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.auth-screen {
  min-height: 100vh;
  background: linear-gradient(180deg, #061d42 0%, #0a285b 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
}

.auth-brand-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
  text-align: center;
}

.brand-mark {
  width: 220px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.brand-mark.small {
  width: 52px;
  height: 52px;
  margin-bottom: 0;
}

.brand-mark__shape {
  position: relative;
  display: block;
  width: 192px;
  height: 90px;
  background: rgba(255,255,255,0.95);
  clip-path: polygon(0 46%, 28% 46%, 42% 0, 59% 0, 76% 46%, 100% 46%, 100% 62%, 72% 62%, 58% 100%, 39% 100%, 24% 62%, 0 62%);
  transform: skewX(-18deg);
  border-radius: 8px;
}

.brand-mark.small .brand-mark__shape {
  width: 52px;
  height: 18px;
  border-radius: 5px;
  clip-path: polygon(0 32%, 30% 32%, 48% 0, 64% 0, 82% 32%, 100% 32%, 100% 56%, 74% 56%, 58% 100%, 38% 100%, 20% 56%, 0 56%);
}

.brand-title {
  margin: 0;
  font-size: clamp(4rem, 7vw, 8rem);
  font-weight: 800;
  letter-spacing: -0.08em;
  color: #f4f5f7;
  line-height: 0.9;
}

.brand-subtitle {
  margin: 16px 0 0;
  color: rgba(255,255,255,0.8);
  font-size: 1.4rem;
  letter-spacing: 0.08em;
}

.auth-panel {
  width: min(100%, 520px);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 26px 20px 18px;
  backdrop-filter: blur(12px);
}

.auth-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 22px;
}

.auth-tab {
  border: 0;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 700;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.75);
}

.auth-tab.active {
  background: #f3f5f7;
  color: var(--navy-900);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-form label,
.withdraw-form label {
  display: block;
  font-weight: 600;
  color: var(--ink);
}

.auth-form input,
.withdraw-form input,
.support-form textarea {
  width: 100%;
  border: 1px solid var(--grey-300);
  background: rgba(255,255,255,0.73);
  border-radius: 14px;
  padding: 15px 16px;
  margin-top: 10px;
  outline: none;
  font-size: 1rem;
}

.auth-form input:focus,
.withdraw-form input:focus,
.support-form textarea:focus {
  border-color: var(--navy-700);
  box-shadow: 0 0 0 3px rgba(18,56,114,0.12);
}

.primary-btn,
.continue-btn,
.support-cta,
.settings-item,
.admin-request button {
  border: 0;
  border-radius: 16px;
  background: var(--navy-900);
  color: var(--white);
  font-weight: 700;
  transition: transform 0.2s ease;
}

.primary-btn:hover,
.continue-btn:hover,
.support-cta:hover,
.settings-item:hover,
.admin-request button:hover {
  transform: translateY(-1px);
}

.auth-submit {
  margin-top: 8px;
  padding: 16px 22px;
}

.app-shell {
  min-height: 100vh;
  background: #efeff0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 22px 0 18px;
  background: rgba(255,255,255,0.9);
  border-bottom: 1px solid rgba(17,24,39,0.08);
  position: sticky;
  top: 0;
  z-index: 20;
}

.menu-button {
  width: 46px;
  height: 46px;
  background: transparent;
  border: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 0;
}

.menu-button span {
  display: block;
  width: 32px;
  height: 4px;
  border-radius: 999px;
  background: #121d2d;
}

.brand-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #061d42;
  color: white;
  padding: 8px 12px 8px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;
}

.dashboard {
  max-width: 1100px;
  margin: 0 auto;
  padding: 42px 18px 80px;
}

.withdraw-page {
  padding: 0 0 20px;
}

.withdraw-page h1,
.summary-page h1,
.support-page h1,
.settings-page h1 {
  margin: 0 0 10px;
  font-weight: 800;
  font-size: clamp(2.9rem, 6vw, 5rem);
  letter-spacing: -0.06em;
  color: #121923;
}

.section-lead {
  margin: 0 0 30px;
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  color: #5d6777;
  font-weight: 400;
}

.two-tone-card {
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(17,24,39,0.06);
  border-radius: 26px;
  padding: 18px 18px 24px;
  box-shadow: 0 10px 25px rgba(26,37,54,0.06);
}

.switch-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.choice-box {
  height: 88px;
  border: 2px solid rgba(17,24,39,0.18);
  border-radius: 18px;
  background: rgba(229,232,236,0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-size: clamp(1.2rem, 2.4vw, 2rem);
  font-weight: 600;
  color: var(--ink);
}

.choice-box.active {
  background: #edf0f3;
  border-width: 2px;
  border-color: rgba(17,24,39,0.75);
}

.choice-box .icon-bank,
.choice-box .icon-card {
  font-size: 1.7rem;
}

.withdraw-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.two-up {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.withdraw-form label,
.support-form textarea {
  color: #1c2431;
  font-weight: 600;
  font-size: 1.1rem;
}

.withdraw-form label span {
  display: block;
  margin-bottom: 10px;
}

.withdraw-form input {
  font-size: 1.15rem;
  color: rgba(19,25,34,0.9);
  min-height: 74px;
  border-radius: 18px;
  background: rgba(255,255,255,0.3);
  border: 2px solid rgba(17,24,39,0.14);
}

.continue-btn {
  width: 100%;
  min-height: 80px;
  border-radius: 18px;
  font-size: clamp(1.5rem, 2vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: #d6dce2;
  color: rgba(0,0,0,0.6);
  border: 1px solid rgba(17,24,39,0.06);
}

.token-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.token-alert {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(245, 195, 199, 0.72);
  border: 1px solid rgba(179, 93, 98, 0.25);
  border-radius: 18px;
  padding: 22px 18px;
}

.token-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  color: var(--pink-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
}

.token-copy h3 {
  margin: 0 0 6px;
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  letter-spacing: -0.04em;
}

.token-copy p {
  margin: 0;
  color: var(--pink-text);
  font-size: clamp(1.15rem, 2vw, 1.7rem);
  line-height: 1.4;
}

.token-page h4 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  letter-spacing: -0.05em;
}

.assets-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 1.2rem;
  color: #2d3748;
}

.support-copy {
  margin: 0;
  font-size: clamp(1.14rem, 2vw, 1.65rem);
  line-height: 1.5;
  color: #39485d;
}

.support-cta {
  width: 100%;
  min-height: 70px;
  background: #0b1f45;
  color: var(--white);
  font-size: clamp(1.3rem, 2vw, 2rem);
  font-weight: 700;
  border-radius: 18px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-size: clamp(1.15rem, 2vw, 1.7rem);
  color: #0f172a;
  padding-top: 14px;
  border-top: 1px solid rgba(17,24,39,0.08);
}

.summary-row strong {
  font-weight: 700;
}

.side-drawer {
  position: fixed;
  left: 0;
  top: 88px;
  width: 260px;
  background: rgba(255,255,255,0.96);
  box-shadow: 0 16px 30px rgba(0,0,0,0.14);
  border-right: 1px solid rgba(17,24,39,0.08);
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 15;
}

.drawer-user {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--navy-700);
  padding: 8px 10px 12px;
}

.side-drawer button {
  border: 0;
  background: transparent;
  text-align: left;
  padding: 12px 10px;
  border-radius: 12px;
  color: var(--ink);
  font-size: 1rem;
  font-weight: 600;
}

.side-drawer button:hover {
  background: var(--grey-100);
}

.logout-btn {
  margin-top: 18px;
  color: var(--danger) !important;
}

.balance-block {
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(17,24,39,0.08);
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: clamp(1.2rem, 2vw, 2rem);
  margin-bottom: 20px;
}

.list-panel,
.support-thread,
.settings-list {
  background: rgba(255,255,255,0.72);
  border-radius: 18px;
  border: 1px solid rgba(17,24,39,0.08);
  padding: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 10px;
  border-bottom: 1px solid rgba(17,24,39,0.06);
}

.history-item:last-child {
  border-bottom: 0;
}

.history-item h4 {
  margin: 0 0 6px;
  font-size: 1.1rem;
}

.history-item small {
  color: var(--grey-500);
}

.history-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status {
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 0.8rem;
  font-weight: 700;
}

.status.pending {
  background: rgba(245,158,11,0.14);
  color: #bf7d00;
}

.status.success {
  background: rgba(27,141,86,0.12);
  color: var(--success);
}

.support-thread {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  margin-bottom: 18px;
}

.bubble {
  max-width: 75%;
  padding: 12px 14px;
  border-radius: 16px;
  line-height: 1.5;
  font-size: 1rem;
}

.bubble.user {
  align-self: flex-end;
  background: var(--navy-900);
  color: white;
}

.bubble.admin {
  align-self: flex-start;
  background: #edf1f5;
  color: var(--ink);
}

.support-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.support-form textarea {
  min-height: 120px;
  resize: vertical;
}

.support-form .primary-btn {
  padding: 16px 18px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
}

.settings-item {
  width: 100%;
  text-align: left;
  background: rgba(227,232,236,0.9);
  color: var(--ink);
  border: 1px solid transparent;
  padding: 18px 16px;
  font-size: 1.08rem;
  font-weight: 600;
}

.settings-item.active {
  background: rgba(18,56,114,0.11);
  border-color: rgba(18,56,114,0.2);
}

.settings-item.danger {
  color: var(--danger);
}

.admin-panel {
  position: fixed;
  right: 24px;
  top: 110px;
  width: 320px;
  border-radius: 20px;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(17,24,39,0.08);
  box-shadow: 0 16px 30px rgba(17,24,39,0.08);
  padding: 18px 16px;
}

.admin-panel h3 {
  margin: 0 0 12px;
  font-size: 1.4rem;
}

.admin-request {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid rgba(17,24,39,0.08);
}

.admin-request strong {
  display: block;
  margin-bottom: 4px;
}

.admin-request p {
  margin: 0;
  color: var(--grey-500);
  font-size: 0.9rem;
}

.admin-request button {
  background: var(--navy-700);
  padding: 10px 12px;
  border-radius: 12px;
}

.success-page {
  padding: 24px 0 8px;
  text-align: center;
}

.success-badge {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: rgba(27,141,86,0.12);
  color: var(--success);
  font-size: 2.8rem;
  font-weight: 800;
}

.success-page h3 {
  margin: 0 0 8px;
  font-size: clamp(2rem, 3vw, 3rem);
  letter-spacing: -0.05em;
}

.success-page p {
  margin: 0 0 20px;
  color: #465569;
  font-size: 1.1rem;
}

@media (max-width: 920px) {
  .admin-panel {
    position: static;
    width: 100%;
    margin-top: 22px;
  }
}

@media (max-width: 700px) {
  .switch-grid,
  .two-up {
    grid-template-columns: 1fr;
  }

  .choice-box {
    height: 78px;
    font-size: 1.3rem;
  }

  .withdraw-page h1,
  .summary-page h1,
  .support-page h1,
  .settings-page h1 {
    font-size: 3rem;
  }
}

@media (max-width: 520px) {
  .auth-panel {
    width: 100%;
  }

  .brand-mark {
    width: 180px;
    height: 90px;
  }

  .brand-mark__shape {
    width: 150px;
  }
}
