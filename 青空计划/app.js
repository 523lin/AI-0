(() => {
  "use strict";

  /* =========================================================
     Constants & element references
     ========================================================= */

  const STORAGE_KEY = "aozora-board-v1";
  const DATA_VERSION = 3;
  const STATUSES = ["todo", "doing", "done"];
  const STATUS_LABELS = { todo: "待做", doing: "进行中", done: "已完成" };
  const LEVELS = [3, 2, 0];
  const THEMES = ["light", "dark"];
  const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const COMPLETE_MESSAGE = "继续向着星辰与深渊前进吧";
  const DEFAULT_SIGNATURE = "今日は走りたくない。だからこそ、走る";
  const DEFAULT_SIGNATURE_CN = "今天不想跑，所以才去跑";
  const MAX_AVATAR_CHARS = 600000;

  const els = {
    nameDisplay: document.getElementById("nameDisplay"),
    nameText: document.getElementById("nameText"),
    nameForm: document.getElementById("nameForm"),
    nameInput: document.getElementById("nameInput"),
    nameCancel: document.getElementById("nameCancel"),

    avatarButton: document.getElementById("avatarButton"),
    avatarDefault: document.getElementById("avatarDefault"),
    avatarImage: document.getElementById("avatarImage"),
    avatarInput: document.getElementById("avatarInput"),
    signatureText: document.getElementById("signatureText"),
    signatureTranslation: document.getElementById("signatureTranslation"),
    signatureEditBtn: document.getElementById("signatureEditBtn"),

    themeLightBtn: document.getElementById("themeLightBtn"),
    themeDarkBtn: document.getElementById("themeDarkBtn"),
    themeSkinBtn: document.getElementById("themeSkinBtn"),

    dateSearch: document.getElementById("dateSearch"),
    dateTrigger: document.getElementById("dateTrigger"),
    dateValue: document.getElementById("dateValue"),
    datePicker: document.getElementById("datePicker"),
    todayBtn: document.getElementById("todayBtn"),

    keywordInput: document.getElementById("keywordInput"),
    keywordClear: document.getElementById("keywordClear"),
    tagSearch: document.getElementById("tagSearch"),
    tagTrigger: document.getElementById("tagTrigger"),
    tagValue: document.getElementById("tagValue"),
    tagPopover: document.getElementById("tagPopover"),
    tagOptions: document.getElementById("tagOptions"),
    tagEmpty: document.getElementById("tagEmpty"),
    tagClose: document.getElementById("tagClose"),
    searchEmpty: document.getElementById("searchEmpty"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),

    viewKicker: document.getElementById("viewKicker"),
    viewTitle: document.getElementById("viewTitle"),
    viewSubtitle: document.getElementById("viewSubtitle"),
    progressPanel: document.getElementById("progressPanel"),
    progressLabel: document.getElementById("progressLabel"),
    progressPct: document.getElementById("progressPct"),
    progressDetail: document.getElementById("progressDetail"),
    progressTrack: document.getElementById("progressTrack"),
    progressFill: document.getElementById("progressFill"),
    progressNote: document.getElementById("progressNote"),
    addTaskBtn: document.getElementById("addTaskBtn"),

    board: document.getElementById("board"),
    counts: {
      todo: document.getElementById("countTodo"),
      doing: document.getElementById("countDoing"),
      done: document.getElementById("countDone")
    },
    lists: {
      todo: document.getElementById("listTodo"),
      doing: document.getElementById("listDoing"),
      done: document.getElementById("listDone")
    },

    taskDialog: document.getElementById("taskDialog"),
    dialogKicker: document.getElementById("dialogKicker"),
    dialogHeading: document.getElementById("dialogHeading"),
    dialogDesc: document.getElementById("dialogDesc"),
    dialogClose: document.getElementById("dialogClose"),
    dialogCancel: document.getElementById("dialogCancel"),
    taskForm: document.getElementById("taskForm"),
    taskTitle: document.getElementById("taskTitle"),
    taskDate: document.getElementById("taskDate"),
    taskNote: document.getElementById("taskNote"),
    taskTags: document.getElementById("taskTags"),
    levelTrigger: document.getElementById("levelTrigger"),
    levelSummary: document.getElementById("levelSummary"),
    levelPreview: document.getElementById("levelPreview"),
    levelPanel: document.getElementById("levelPanel"),
    submitTaskBtn: document.getElementById("submitTaskBtn"),

    confirmDialog: document.getElementById("confirmDialog"),
    confirmTaskTitle: document.getElementById("confirmTaskTitle"),
    confirmCancel: document.getElementById("confirmCancel"),
    confirmDelete: document.getElementById("confirmDelete"),

    duplicateDialog: document.getElementById("duplicateDialog"),
    duplicateTaskTitle: document.getElementById("duplicateTaskTitle"),
    duplicateCancel: document.getElementById("duplicateCancel"),
    duplicateConfirm: document.getElementById("duplicateConfirm"),

    signatureDialog: document.getElementById("signatureDialog"),
    signatureClose: document.getElementById("signatureClose"),
    signatureCancel: document.getElementById("signatureCancel"),
    signatureForm: document.getElementById("signatureForm"),
    signatureInput: document.getElementById("signatureInput"),
    signatureCnInput: document.getElementById("signatureCnInput"),

    toast: document.getElementById("toast"),
    toastIcon: document.getElementById("toastIcon"),
    toastMessage: document.getElementById("toastMessage"),
    toastAction: document.getElementById("toastAction")
  };

  const EMPTY_ART = {
    todo: `
      <svg class="empty-art" viewBox="0 0 140 102" aria-hidden="true">
        <defs>
          <linearGradient id="emptyCloudFill" x1="28" y1="14" x2="108" y2="86" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ffffff"></stop>
            <stop offset="1" stop-color="#e9f9fc"></stop>
          </linearGradient>
        </defs>
        <ellipse cx="70" cy="89" rx="31" ry="4.8" fill="#d9eef6" opacity="0.55"></ellipse>
        <path d="M39 78c-13.8 0-24-9-24-21 0-11 8.3-19.2 19-20.9C37 20 51.2 10 67 10c18.7 0 33.6 14.1 35.4 32.2C115.6 44 125 52.7 125 64.6c0 8-5.8 13.4-14.8 13.4H39Z" fill="url(#emptyCloudFill)" stroke="#b8deee" stroke-width="1.4"></path>
        <path d="M51.5 56c2.3 2.6 5 2.6 7.3 0M80.8 56c2.3 2.6 5 2.6 7.3 0" fill="none" stroke="#44647a" stroke-width="2" stroke-linecap="round"></path>
        <path d="M66.5 64.5c2.7 2 5.5 2 8.2 0" fill="none" stroke="#44647a" stroke-width="1.7" stroke-linecap="round"></path>
        <ellipse cx="45" cy="64" rx="5.6" ry="2.8" fill="#f3c6cc" opacity="0.62"></ellipse>
        <ellipse cx="94.5" cy="64" rx="5.6" ry="2.8" fill="#f3c6cc" opacity="0.62"></ellipse>
        <path d="M115 22l1.4 5.1 5.1 1.4-5.1 1.4-1.4 5.1-1.4-5.1-5.1-1.4 5.1-1.4 1.4-5.1Z" fill="#e5c27c"></path>
        <path d="M25 36c-5-3-5.6-9.5-1.4-13.2" fill="none" stroke="#9ed6e7" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="2.4 5"></path>
        <circle cx="23.5" cy="44" r="1.4" fill="#9ed6e7"></circle>
      </svg>`,
    doing: `
      <svg class="empty-art" viewBox="0 0 140 102" aria-hidden="true">
        <defs>
          <linearGradient id="emptyPlaneFill" x1="50" y1="28" x2="107" y2="78" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ffffff"></stop>
            <stop offset="1" stop-color="#dff6fa"></stop>
          </linearGradient>
        </defs>
        <ellipse cx="72" cy="88" rx="31" ry="4.4" fill="#d9eef6" opacity="0.45"></ellipse>
        <path d="M16 76c20-3 30-19 46-26" fill="none" stroke="#a3d9e7" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="2.5 5.5"></path>
        <path d="M23 83c8-1 13-4 18-8" fill="none" stroke="#c5e8f1" stroke-width="1.1" stroke-linecap="round" stroke-dasharray="2 5"></path>
        <path d="M49 58 118 20 94 82 73 65 49 58Z" fill="url(#emptyPlaneFill)" stroke="#aed9ea" stroke-width="1.4" stroke-linejoin="round"></path>
        <path d="M73 65 118 20 83 69" fill="#e7f9fc" stroke="#aed9ea" stroke-width="1.1" stroke-linejoin="round"></path>
        <path d="M73 65 68 81 82 70" fill="#d9f3f8" stroke="#aed9ea" stroke-width="1.1" stroke-linejoin="round"></path>
        <path d="M112 77l1.3 4.8 4.8 1.3-4.8 1.3-1.3 4.8-1.3-4.8-4.8-1.3 4.8-1.3 1.3-4.8Z" fill="#e5c27c"></path>
        <circle cx="34" cy="34" r="1.8" fill="#a9dce8"></circle>
        <circle cx="116" cy="46" r="1.4" fill="#c6e8f0"></circle>
      </svg>`,
    done: `
      <svg class="empty-art" viewBox="0 0 140 102" aria-hidden="true">
        <defs>
          <linearGradient id="emptyStarFill" x1="42" y1="16" x2="92" y2="86" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ffffff"></stop>
            <stop offset="1" stop-color="#e4f8f9"></stop>
          </linearGradient>
        </defs>
        <ellipse cx="70" cy="89" rx="29" ry="4.4" fill="#d9eef6" opacity="0.5"></ellipse>
        <path d="M70 13c3.4 21.1 14.2 31.9 35.3 35.3C84.2 51.7 73.4 62.5 70 83.6 66.6 62.5 55.8 51.7 34.7 48.3 55.8 44.9 66.6 34.1 70 13Z" fill="url(#emptyStarFill)" stroke="#b7dfe8" stroke-width="1.4" stroke-linejoin="round"></path>
        <path d="M61 49.5c1.7 1.9 3.7 1.9 5.4 0M75 49.5c1.7 1.9 3.7 1.9 5.4 0" fill="none" stroke="#44647a" stroke-width="1.7" stroke-linecap="round"></path>
        <path d="M66.5 56c2.2 1.7 4.5 1.7 6.7 0" fill="none" stroke="#44647a" stroke-width="1.5" stroke-linecap="round"></path>
        <ellipse cx="56" cy="54" rx="4.4" ry="2.2" fill="#f3c6cc" opacity="0.62"></ellipse>
        <ellipse cx="84" cy="54" rx="4.4" ry="2.2" fill="#f3c6cc" opacity="0.62"></ellipse>
        <path d="M109 24l1.2 4.3 4.3 1.2-4.3 1.2-1.2 4.3-1.2-4.3-4.3-1.2 4.3-1.2 1.2-4.3Z" fill="#e5c27c"></path>
        <path d="M29 34l.9 3 3 .9-3 .9-.9 3-.9-3-3-.9 3-.9.9-3Z" fill="#a6dce7"></path>
        <circle cx="108" cy="70" r="1.3" fill="#a6dce7"></circle>
      </svg>`
  };

  /* =========================================================
     App state
     ========================================================= */

  let state = null;
  let activeDate = null;
  let keyword = "";
  let selectedTag = null;
  let editingId = null;
  let pendingDeleteId = null;
  let draggedId = null;
  let currentDropColumn = null;
  let justCompletedId = null;
  let toastTimer = null;
  let toastActionHandler = null;
  let storageBlocked = false;
  let firstRun = false;
  let meteorTrackingTimer = null;
  const meteorClearTimers = new Map();

  /* =========================================================
     Utilities
     ========================================================= */

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function uid() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      switch (character) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#039;";
        default: return character;
      }
    });
  }

  function truncate(value, maxLength) {
    const text = String(value);
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
  }

  function dateKeyFromDate(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function todayKey() {
    return dateKeyFromDate(new Date());
  }

  function shiftedDateKey(offset) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return dateKeyFromDate(date);
  }

  function dateFromKey(key) {
    const parts = String(key).split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
  }

  function isValidDateKey(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(key))) return false;
    return dateKeyFromDate(dateFromKey(key)) === String(key);
  }

  function formatFullDate(key) {
    const date = dateFromKey(key);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · ${WEEKDAYS[date.getDay()]}`;
  }

  function formatMonthDay(key) {
    const date = dateFromKey(key);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function formatDateTrigger(key) {
    const date = dateFromKey(key);
    const weekday = WEEKDAYS[date.getDay()].replace("星期", "周");
    if (key === todayKey()) return `今天 · ${formatMonthDay(key)}`;
    return `${formatMonthDay(key)} · ${weekday}`;
  }

  function taskDateLabel(task) {
    const today = todayKey();
    if (task.due === today) return "今天";
    if (task.due === shiftedDateKey(1)) return "明天";
    if (task.status !== "done" && task.due < today) return `逾期 · ${formatMonthDay(task.due)}`;
    return formatMonthDay(task.due);
  }

  function normalizeTags(value) {
    const rawList = Array.isArray(value)
      ? value
      : String(value ?? "").split(/[,，、;；\s]+/);
    const tags = [];
    const seen = new Set();

    for (const rawTag of rawList) {
      let tag = String(rawTag ?? "").trim().replace(/^#+/, "").slice(0, 12);
      if (!tag) continue;
      const key = tag.toLocaleLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      tags.push(tag);
      if (tags.length >= 5) break;
    }

    return tags;
  }

  function normalizeLevel(rawTask) {
    const numericLevel = Number(rawTask?.level);
    if (numericLevel === 3 || numericLevel === 2) return numericLevel;
    if (rawTask?.important === true) return 3;
    return 0;
  }

  function levelLabel(level) {
    if (level === 3) return "重要等级 · 三颗星";
    if (level === 2) return "次要等级 · 两颗星";
    return "未标记 · 普通任务";
  }

  function starIconsHTML(level) {
    const count = level === 3 ? 3 : level === 2 ? 2 : 0;
    return Array.from({ length: count }, () => (
      '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-star"></use></svg>'
    )).join("");
  }

  function compareTasks(a, b) {
    if (a.level !== b.level) return b.level - a.level;
    if (a.status === "done" && b.status === "done") return (b.completedAt || 0) - (a.completedAt || 0);
    return (a.createdAt || 0) - (b.createdAt || 0);
  }

  /* =========================================================
     Storage & seed data
     ========================================================= */

  function seedState() {
    const now = Date.now();
    const today = todayKey();
    const tomorrow = shiftedDateKey(1);

    return {
      version: DATA_VERSION,
      profile: {
        name: "同学",
        signature: DEFAULT_SIGNATURE,
        signatureCn: DEFAULT_SIGNATURE_CN,
        avatar: "",
        theme: "light"
      },
      tasks: [
        {
          id: uid(),
          title: "整理今天的三个小目标",
          notes: "先写下来，再一件一件完成。",
          due: today,
          status: "todo",
          level: 3,
          tags: ["计划", "今日"],
          createdAt: now - 4 * 60 * 1000
        },
        {
          id: uid(),
          title: "复习数学 · 第三章函数",
          notes: "重点：单调性与最值。",
          due: today,
          status: "doing",
          level: 3,
          tags: ["学习", "数学"],
          createdAt: now - 3 * 60 * 1000
        },
        {
          id: uid(),
          title: "给明天留一份预习清单",
          notes: "不用很多，三条就好。",
          due: tomorrow,
          status: "todo",
          level: 2,
          tags: ["计划"],
          createdAt: now - 2 * 60 * 1000
        },
        {
          id: uid(),
          title: "完成英语单词打卡",
          notes: "",
          due: today,
          status: "done",
          level: 2,
          tags: ["英语", "习惯"],
          createdAt: now - 5 * 60 * 1000,
          completedAt: now - 60 * 1000,
          completedFrom: "todo"
        }
      ]
    };
  }

  function normalizeTask(rawTask, index, seenIds) {
    if (!rawTask || typeof rawTask !== "object") return null;

    const title = String(rawTask.title ?? "").trim().slice(0, 80);
    if (!title) return null;

    let id = String(rawTask.id ?? "").replace(/[^a-zA-Z0-9_-]/g, "");
    if (!id || seenIds.has(id)) id = uid();
    seenIds.add(id);

    const status = STATUSES.includes(rawTask.status) ? rawTask.status : "todo";
    const due = isValidDateKey(rawTask.due) ? rawTask.due : todayKey();
    const createdAt = Number.isFinite(rawTask.createdAt) ? rawTask.createdAt : Date.now() + index;
    const completedFrom = STATUSES.includes(rawTask.completedFrom) && rawTask.completedFrom !== "done"
      ? rawTask.completedFrom
      : null;
    const completedAt = status === "done"
      ? (Number.isFinite(rawTask.completedAt) ? rawTask.completedAt : createdAt)
      : null;

    return {
      id,
      title,
      notes: String(rawTask.notes ?? "").trim().slice(0, 160),
      due,
      status,
      level: normalizeLevel(rawTask),
      tags: normalizeTags(rawTask.tags),
      createdAt,
      completedAt,
      completedFrom: status === "done" ? (completedFrom || "todo") : null
    };
  }

  function normalizeProfile(rawProfile) {
    const profile = rawProfile && typeof rawProfile === "object" ? rawProfile : {};
    const name = typeof profile.name === "string" && profile.name.trim()
      ? profile.name.trim().slice(0, 16)
      : "同学";
    const signature = typeof profile.signature === "string" && profile.signature.trim()
      ? profile.signature.trim().slice(0, 90)
      : DEFAULT_SIGNATURE;
    const signatureCn = typeof profile.signatureCn === "string"
      ? profile.signatureCn.trim().slice(0, 60)
      : DEFAULT_SIGNATURE_CN;
    const avatar = typeof profile.avatar === "string"
      && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(profile.avatar)
      && profile.avatar.length <= MAX_AVATAR_CHARS
      ? profile.avatar
      : "";
    const theme = THEMES.includes(profile.theme) ? profile.theme : "light";

    return { name, signature, signatureCn, avatar, theme };
  }

  function normalizeState(raw) {
    if (!raw || typeof raw !== "object") return seedState();

    const seenIds = new Set();
    const tasks = Array.isArray(raw.tasks)
      ? raw.tasks.map((task, index) => normalizeTask(task, index, seenIds)).filter(Boolean)
      : [];

    return {
      version: DATA_VERSION,
      profile: normalizeProfile(raw.profile),
      tasks
    };
  }

  function readStorage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      storageBlocked = true;
      return null;
    }
  }

  function persist(options = {}) {
    const { silent = false } = options;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: DATA_VERSION,
        profile: state.profile,
        tasks: state.tasks
      }));
      return true;
    } catch (error) {
      if (!storageBlocked) {
        storageBlocked = true;
        if (!silent) {
          window.setTimeout(() => {
            showToast("浏览器未允许本地保存，本次修改只在当前页面有效。", { type: "error" });
          }, 300);
        }
      }
      return false;
    }
  }

  function loadInitialState() {
    const raw = readStorage();

    if (raw === null) {
      state = seedState();
      firstRun = true;
      persist({ silent: true });
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      state = normalizeState(parsed);
      const needsMigration = parsed.version !== DATA_VERSION
        || !Array.isArray(parsed.tasks)
        || parsed.tasks.some((task) => task && (
          Object.prototype.hasOwnProperty.call(task, "important")
          || !Array.isArray(task.tags)
        ));
      if (needsMigration) persist({ silent: true });
    } catch (error) {
      state = seedState();
      persist({ silent: true });
    }
  }

  /* =========================================================
     Search helpers
     ========================================================= */

  function getDayTasks(date = activeDate) {
    return state.tasks.filter((task) => task.due === date);
  }

  function hasSearchFilters() {
    return Boolean(keyword.trim() || selectedTag);
  }

  function getFilteredTasks(dayTasks) {
    const needle = keyword.trim().toLocaleLowerCase();

    return dayTasks.filter((task) => {
      if (selectedTag) {
        const hasTag = task.tags.some((tag) => tag.toLocaleLowerCase() === selectedTag.toLocaleLowerCase());
        if (!hasTag) return false;
      }

      if (needle) {
        const haystack = `${task.title}\n${task.notes}\n${task.tags.join(" ")}`.toLocaleLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      return true;
    });
  }

  function getDayTagEntries(date = activeDate) {
    const counts = new Map();

    for (const task of getDayTasks(date)) {
      for (const tag of task.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
      .map(([tag, count]) => ({ tag, count }));
  }

  function ensureSelectedTagAvailable() {
    if (!selectedTag) return;
    const stillAvailable = getDayTasks().some((task) =>
      task.tags.some((tag) => tag.toLocaleLowerCase() === selectedTag.toLocaleLowerCase())
    );
    if (!stillAvailable) selectedTag = null;
  }

  function isDayComplete(tasks = getDayTasks()) {
    return tasks.length > 0 && tasks.every((task) => task.status === "done");
  }

  /* =========================================================
     Rendering
     ========================================================= */

  function renderAll() {
    ensureSelectedTagAvailable();
    renderProfile();
    renderTheme();
    renderDateUI();
    renderSearchUI();
    renderBoard();
    syncMeteorTracking();
  }

  function renderProfile() {
    const profile = state.profile;
    els.nameText.textContent = profile.name || "同学";

    const signature = profile.signature || DEFAULT_SIGNATURE;
    const signatureCn = profile.signatureCn || "";
    els.signatureText.textContent = signature;
    els.signatureTranslation.textContent = signatureCn;
    els.signatureTranslation.hidden = !signatureCn;
    els.signatureEditBtn.setAttribute(
      "aria-label",
      `编辑个性签名。当前签名：${signature}${signatureCn ? `，${signatureCn}` : ""}`
    );
    els.signatureText.setAttribute(
      "aria-label",
      `编辑个性签名。当前签名：${signature}${signatureCn ? `，${signatureCn}` : ""}`
    );

    if (profile.avatar) {
      if (els.avatarImage.getAttribute("src") !== profile.avatar) {
        els.avatarImage.setAttribute("src", profile.avatar);
      }
      els.avatarImage.hidden = false;
      els.avatarDefault.hidden = true;
      els.avatarButton.classList.add("has-image");
    } else {
      els.avatarImage.hidden = true;
      els.avatarImage.removeAttribute("src");
      els.avatarDefault.hidden = false;
      els.avatarButton.classList.remove("has-image");
    }
  }

  function renderTheme() {
    const theme = THEMES.includes(state.profile.theme) ? state.profile.theme : "light";
    const isDark = theme === "dark";

    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#07111f" : "#f3faff");

    els.themeLightBtn.setAttribute("aria-pressed", String(!isDark));
    els.themeDarkBtn.setAttribute("aria-pressed", String(isDark));
  }

  function updateMeteorColumnClearing() {
    if (document.documentElement.dataset.theme !== "dark") {
      stopMeteorTracking();
      return;
    }
    if (document.hidden) return;

    const columns = [...document.querySelectorAll("#board .column")];
    if (!columns.length) return;

    const meteorRects = [...document.querySelectorAll(".meteor")]
      .map((meteor) => {
        if (Number(getComputedStyle(meteor).opacity) < 0.06) return null;
        return meteor.getBoundingClientRect();
      })
      .filter(Boolean);

    for (const column of columns) {
      const rect = column.getBoundingClientRect();
      const hit = meteorRects.some((meteorRect) =>
        meteorRect.right > rect.left + 8
        && meteorRect.left < rect.right - 8
        && meteorRect.bottom > rect.top + 8
        && meteorRect.top < rect.bottom - 8
      );

      if (hit) {
        const existingTimer = meteorClearTimers.get(column);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
          meteorClearTimers.delete(column);
        }
        column.classList.add("is-meteor-cleared");
      } else if (column.classList.contains("is-meteor-cleared") && !meteorClearTimers.has(column)) {
        const timer = window.setTimeout(() => {
          column.classList.remove("is-meteor-cleared");
          meteorClearTimers.delete(column);
        }, 460);
        meteorClearTimers.set(column, timer);
      }
    }
  }

  function stopMeteorTracking() {
    if (meteorTrackingTimer !== null) {
      window.clearInterval(meteorTrackingTimer);
      meteorTrackingTimer = null;
    }
    for (const timer of meteorClearTimers.values()) {
      window.clearTimeout(timer);
    }
    meteorClearTimers.clear();
    document.querySelectorAll("#board .column.is-meteor-cleared").forEach((column) => {
      column.classList.remove("is-meteor-cleared");
    });
  }

  function syncMeteorTracking() {
    if (document.documentElement.dataset.theme !== "dark") {
      stopMeteorTracking();
      return;
    }

    if (meteorTrackingTimer === null) {
      updateMeteorColumnClearing();
      meteorTrackingTimer = window.setInterval(updateMeteorColumnClearing, 80);
    }
  }

  function changeTheme(nextTheme, options = {}) {
    const { announce = true } = options;
    if (!THEMES.includes(nextTheme)) return;

    const changed = state.profile.theme !== nextTheme;
    state.profile.theme = nextTheme;
    renderTheme();
    syncMeteorTracking();

    if (!changed) return;

    const saved = persist({ silent: true });
    if (!announce) return;

    const label = nextTheme === "dark" ? "已切换为深色模式" : "已切换为浅色模式";
    showToast(saved ? label : `${label} · 本地保存失败`, {
      type: saved ? "success" : "error"
    });
  }

  function renderDateUI() {
    els.dateSearch.classList.toggle("is-active", activeDate !== todayKey());
    els.todayBtn.classList.toggle("is-active", activeDate === todayKey());
    els.dateValue.textContent = formatDateTrigger(activeDate);
    els.dateTrigger.setAttribute("aria-label", `按日期检索任务，当前查看${formatFullDate(activeDate)}，点击更改日期`);
    els.datePicker.value = activeDate;
  }

  function isAnyDialogOpen() {
    return Boolean(
      els.taskDialog.open
      || els.confirmDialog.open
      || els.duplicateDialog.open
      || els.signatureDialog.open
    );
  }

  function syncModalState() {
    document.body.classList.toggle("modal-open", isAnyDialogOpen());
  }

  function renderSearchUI() {
    if (els.keywordInput.value !== keyword) els.keywordInput.value = keyword;
    els.keywordClear.hidden = keyword.length === 0;
    els.keywordInput.closest(".keyword-box").classList.toggle("has-value", keyword.length > 0);

    els.tagValue.textContent = selectedTag ? `#${selectedTag}` : "全部标签";
    els.tagTrigger.classList.toggle("is-active", Boolean(selectedTag));
    els.tagTrigger.setAttribute(
      "aria-label",
      selectedTag ? `标签检索，当前标签：${selectedTag}` : "标签检索，当前显示全部标签"
    );

    renderTagOptions();
  }

  function renderTagOptions() {
    const dayTasks = getDayTasks();
    const tagEntries = getDayTagEntries();

    const allOption = `
      <button class="tag-option${selectedTag ? "" : " is-selected"}" type="button" role="option"
        aria-selected="${selectedTag ? "false" : "true"}" data-tag-option="">
        <span class="tag-option-name">全部标签</span>
        <span class="tag-option-count">${dayTasks.length}</span>
      </button>`;

    const tagButtons = tagEntries.map(({ tag, count }) => {
      const isSelected = selectedTag && selectedTag.toLocaleLowerCase() === tag.toLocaleLowerCase();
      return `
        <button class="tag-option${isSelected ? " is-selected" : ""}" type="button" role="option"
          aria-selected="${isSelected ? "true" : "false"}" data-tag-option="${escapeHTML(tag)}">
          <span class="tag-option-name"># ${escapeHTML(tag)}</span>
          <span class="tag-option-count">${count}</span>
        </button>`;
    }).join("");

    els.tagOptions.innerHTML = allOption + tagButtons;
    els.tagEmpty.hidden = tagEntries.length > 0;
  }

  function renderBoard(options = {}) {
    const { resetScroll = false } = options;
    const previousScroll = {};

    if (!resetScroll) {
      for (const status of STATUSES) {
        previousScroll[status] = els.lists[status].scrollTop;
      }
    }

    const dayTasks = getDayTasks();
    const filteredTasks = getFilteredTasks(dayTasks);
    const groups = { todo: [], doing: [], done: [] };

    for (const task of filteredTasks) {
      groups[task.status].push(task);
    }

    for (const status of STATUSES) {
      groups[status].sort(compareTasks);
    }

    const dayDoneCount = dayTasks.filter((task) => task.status === "done").length;

    for (const status of STATUSES) {
      const tasks = groups[status];
      const countEl = els.counts[status];
      const listEl = els.lists[status];

      countEl.textContent = pad2(tasks.length);
      countEl.setAttribute("aria-label", `${tasks.length} 项任务`);

      if (tasks.length === 0) {
        listEl.innerHTML = emptyStateHTML(status, dayTasks.length, hasSearchFilters());
      } else {
        listEl.innerHTML = tasks.map((task, index) => taskCardHTML(task, index)).join("");
      }
    }

    renderBoardHeading(dayTasks, filteredTasks, dayDoneCount);
    renderProgress(dayTasks.length, dayDoneCount);
    renderSearchEmpty(dayTasks.length, filteredTasks.length);

    if (!resetScroll) {
      for (const status of STATUSES) {
        const listEl = els.lists[status];
        listEl.scrollTop = Math.min(
          previousScroll[status] || 0,
          Math.max(0, listEl.scrollHeight - listEl.clientHeight)
        );
      }
    } else {
      for (const status of STATUSES) {
        els.lists[status].scrollTop = 0;
      }
    }

    justCompletedId = null;
  }

  function renderBoardHeading(dayTasks, filteredTasks, dayDoneCount) {
    const isToday = activeDate === todayKey();
    const filtersActive = hasSearchFilters();

    els.viewKicker.textContent = isToday ? "TODAY · 今日任务" : "DATE VIEW · 日期视图";
    els.viewTitle.textContent = isToday ? "今天，也慢慢向前。" : formatFullDate(activeDate);

    if (dayTasks.length === 0) {
      els.viewSubtitle.textContent = "这一天还没有任务，点一下「新建任务」开始吧。";
      return;
    }

    let subtitle = isToday
      ? `${formatFullDate(activeDate)} · 共 ${dayTasks.length} 项 · 已完成 ${dayDoneCount} 项`
      : `共 ${dayTasks.length} 项 · 已完成 ${dayDoneCount} 项`;

    if (filtersActive) {
      subtitle += ` · 检索到 ${filteredTasks.length} 项`;
    }

    els.viewSubtitle.textContent = subtitle;
  }

  function renderProgress(total, doneCount) {
    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
    const complete = total > 0 && doneCount === total;

    els.progressLabel.textContent = "当日完成度";
    els.progressPct.textContent = `${percent}%`;
    els.progressDetail.textContent = `${doneCount} / ${total}`;
    els.progressFill.style.width = `${percent}%`;
    els.progressTrack.setAttribute("aria-valuenow", String(percent));
    els.progressTrack.setAttribute("aria-valuetext", `当日 ${doneCount} / ${total} 项已完成，${percent}%`);
    els.progressPanel.classList.toggle("is-complete", complete);

    if (total === 0) {
      els.progressNote.textContent = "这一天还没有任务，先放一件小事进来。";
    } else if (complete) {
      els.progressNote.textContent = COMPLETE_MESSAGE;
    } else if (doneCount === 0) {
      els.progressNote.textContent = "从一件小事开始，就很好。";
    } else {
      els.progressNote.textContent = `再完成 ${total - doneCount} 件，就全部点亮了。`;
    }
  }

  function renderSearchEmpty(dayTotal, resultTotal) {
    const show = hasSearchFilters() && dayTotal > 0 && resultTotal === 0;
    els.searchEmpty.hidden = !show;
    els.board.classList.toggle("board--compact", show);
  }

  function taskCardHTML(task, index) {
    const isDone = task.status === "done";
    const isToday = task.due === todayKey();
    const isOverdue = !isDone && task.due < todayKey();
    const dateClasses = ["task-date"];
    if (isToday) dateClasses.push("is-today");
    if (isOverdue) dateClasses.push("is-overdue");
    const isJustCompleted = task.id === justCompletedId;

    const levelBadge = task.level
      ? `
        <span class="task-level level-${task.level}" title="${levelLabel(task.level)}"
          aria-label="${task.level === 3 ? "重要等级，三颗星" : "次要等级，两颗星"}">
          <span class="task-level-stars" aria-hidden="true">${starIconsHTML(task.level)}</span>
          <span class="task-level-name">${task.level === 3 ? "重要" : "次要"}</span>
        </span>`
      : "";

    const tags = task.tags.length
      ? `
        <div class="task-tags">
          ${task.tags.map((tag) => `
            <button class="task-tag" type="button" data-task-tag="${escapeHTML(tag)}"
              aria-label="按标签检索：${escapeHTML(tag)}" title="按标签检索：${escapeHTML(tag)}">#${escapeHTML(tag)}</button>
          `).join("")}
        </div>`
      : "";

    const quickActions = task.status === "todo"
      ? `
        <div class="task-quick-actions">
          <button class="quick-move quick-move--doing" type="button" data-action="to-doing"
            aria-label="将任务移到进行中：${escapeHTML(task.title)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
            移至进行中
          </button>
          <button class="quick-move quick-move--done" type="button" data-action="to-done"
            aria-label="将任务标记为完成：${escapeHTML(task.title)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-check"></use></svg>
            直接完成
          </button>
        </div>`
      : "";

    return `
      <article class="task-card${isDone ? " is-done" : ""}${isJustCompleted ? " is-just-completed" : ""}"
        data-id="${escapeHTML(task.id)}"
        draggable="true"
        style="--i: ${Math.min(index, 7)}">
        <button class="task-check" type="button" role="checkbox" aria-checked="${isDone}"
          data-action="toggle"
          aria-label="${isDone ? "取消完成" : "标记完成"}：${escapeHTML(task.title)}"
          title="${isDone ? "取消完成" : "标记完成"}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-check"></use></svg>
        </button>
        <div class="task-main">
          <div class="task-meta">
            <span class="${dateClasses.join(" ")}" title="计划日期：${formatFullDate(task.due)}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-calendar"></use></svg>
              ${taskDateLabel(task)}
            </span>
            ${levelBadge}
          </div>
          <h3 class="task-title">${escapeHTML(task.title)}</h3>
          ${task.notes ? `<p class="task-note">${escapeHTML(task.notes)}</p>` : ""}
          ${tags}
        </div>
        <div class="task-actions">
          <button class="task-action" type="button" data-action="edit"
            aria-label="编辑任务：${escapeHTML(task.title)}" title="编辑">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-pencil"></use></svg>
          </button>
          <button class="task-action" type="button" data-action="delete"
            aria-label="删除任务：${escapeHTML(task.title)}" title="删除">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-trash"></use></svg>
          </button>
        </div>
        ${quickActions}
      </article>`;
  }

  function emptyStateHTML(status, dayTotal, filtersActive) {
    const filterMode = filtersActive && dayTotal > 0;
    const copy = filterMode
      ? {
          todo: { title: "没有匹配的待做任务", text: "换个关键词或标签再试试。" },
          doing: { title: "没有匹配的进行中任务", text: "当前检索条件下，这一栏暂时为空。" },
          done: { title: "没有匹配的完成记录", text: "换个关键词或标签再试试。" }
        }[status]
      : {
          todo: { title: "这一天还没有待做任务", text: "把想做的事轻轻放进来，从一件小事开始。" },
          doing: { title: "暂时没有进行中的事", text: "把正在专注的事放到这里，给注意力一个落点。" },
          done: { title: "这一天还没有完成记录", text: "每完成一件，就会在这里留下一颗小星星。" }
        }[status];

    const action = filterMode
      ? ""
      : `<button class="empty-add" type="button" data-add-status="${status}">＋ 添加任务</button>`;

    return `
      <div class="empty-state">
        ${EMPTY_ART[status]}
        <h3>${copy.title}</h3>
        <p>${copy.text}</p>
        ${action}
      </div>`;
  }

  /* =========================================================
     Date & tag controls
     ========================================================= */

  function setActiveDate(nextDate) {
    const normalized = isValidDateKey(nextDate) ? nextDate : todayKey();
    if (normalized === activeDate) {
      renderDateUI();
      return;
    }

    activeDate = normalized;
    ensureSelectedTagAvailable();
    closeTagPopover();
    renderAll();
  }

  function openDatePicker() {
    closeTagPopover();
    if (typeof els.datePicker.showPicker === "function") {
      try {
        els.datePicker.showPicker();
        return;
      } catch (error) {
        // Fall through to the focus/click fallback.
      }
    }

    els.datePicker.focus();
    els.datePicker.click();
  }

  function openTagPopover() {
    renderTagOptions();
    els.tagPopover.hidden = false;
    els.tagTrigger.setAttribute("aria-expanded", "true");

    window.requestAnimationFrame(() => {
      const selected = els.tagOptions.querySelector(".tag-option.is-selected");
      const first = els.tagOptions.querySelector(".tag-option");
      (selected || first)?.focus({ preventScroll: true });
    });
  }

  function closeTagPopover(options = {}) {
    if (els.tagPopover.hidden) return;
    els.tagPopover.hidden = true;
    els.tagTrigger.setAttribute("aria-expanded", "false");
    if (options.returnFocus) els.tagTrigger.focus({ preventScroll: true });
  }

  function toggleTagPopover() {
    if (els.tagPopover.hidden) openTagPopover();
    else closeTagPopover({ returnFocus: true });
  }

  function selectTag(tag, options = {}) {
    const { returnFocus = false } = options;
    selectedTag = tag || null;
    closeTagPopover();
    renderSearchUI();
    renderBoard({ resetScroll: true });
    if (returnFocus) els.tagTrigger.focus({ preventScroll: true });
  }

  function clearKeyword(options = {}) {
    keyword = "";
    els.keywordInput.value = "";
    els.keywordClear.hidden = true;
    els.keywordInput.closest(".keyword-box").classList.remove("has-value");
    renderBoard({ resetScroll: true });
    if (options.focus) els.keywordInput.focus();
  }

  function clearSearchFilters(options = {}) {
    keyword = "";
    selectedTag = null;
    els.keywordInput.value = "";
    els.keywordClear.hidden = true;
    els.keywordInput.closest(".keyword-box").classList.remove("has-value");
    closeTagPopover();
    renderSearchUI();
    renderBoard({ resetScroll: true });
    if (options.focus) els.keywordInput.focus();
  }

  function resetSearchState() {
    keyword = "";
    selectedTag = null;
    els.keywordInput.value = "";
    els.keywordClear.hidden = true;
    els.keywordInput.closest(".keyword-box").classList.remove("has-value");
    closeTagPopover();
  }

  /* =========================================================
     Task dialog
     ========================================================= */

  function setLevelPanel(open) {
    els.levelPanel.hidden = !open;
    els.levelTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function updateLevelPreview(level) {
    const value = LEVELS.includes(level) ? level : 0;
    els.levelSummary.textContent = levelLabel(value);
    els.levelPreview.className = `level-preview${value ? ` level-${value}` : ""}`;
    els.levelPreview.innerHTML = value
      ? starIconsHTML(value)
      : '<span class="level-preview-empty" aria-hidden="true">—</span>';
  }

  function setLevelSelection(level) {
    const value = LEVELS.includes(level) ? level : 0;
    const radio = els.taskForm.querySelector(`input[name="taskLevel"][value="${value}"]`);
    if (radio) radio.checked = true;
    updateLevelPreview(value);
    setLevelPanel(false);
  }

  function getSelectedLevel() {
    const checked = els.taskForm.querySelector('input[name="taskLevel"]:checked');
    const value = checked ? Number(checked.value) : 0;
    return LEVELS.includes(value) ? value : 0;
  }

  function openTaskDialog(options = {}) {
    if (els.taskDialog.open) return;

    const { id = null, status: requestedStatus = "todo" } = options;
    const task = id ? state.tasks.find((item) => item.id === id) : null;
    editingId = task ? task.id : null;

    closeTagPopover();
    els.taskForm.reset();
    els.taskTitle.setCustomValidity("");
    els.taskDate.setCustomValidity("");

    const status = task?.status || (STATUSES.includes(requestedStatus) ? requestedStatus : "todo");
    const statusRadio = els.taskForm.querySelector(`input[name="status"][value="${status}"]`);
    if (statusRadio) statusRadio.checked = true;

    els.taskTitle.value = task?.title || "";
    els.taskDate.value = task?.due || activeDate || todayKey();
    els.taskNote.value = task?.notes || "";
    els.taskTags.value = task ? task.tags.join("，") : "";
    setLevelSelection(task?.level || 0);

    if (task) {
      els.dialogKicker.textContent = "EDIT TASK · 编辑任务";
      els.dialogHeading.textContent = "把这件事，再整理一下";
      els.dialogDesc.textContent = "改一改细节，或者把它移到更合适的位置。";
      els.submitTaskBtn.textContent = "保存修改";
    } else {
      els.dialogKicker.textContent = "NEW TASK · 新建任务";
      els.dialogHeading.textContent = "记下一件想做的事";
      els.dialogDesc.textContent = `默认放进 ${formatMonthDay(activeDate)}，也可以换一个日期。`;
      els.submitTaskBtn.textContent = "添加任务";
    }

    els.taskDialog.showModal();
    syncModalState();

    window.requestAnimationFrame(() => {
      els.taskTitle.focus();
      const length = els.taskTitle.value.length;
      if (task) els.taskTitle.setSelectionRange(length, length);
      else els.taskTitle.select();
    });
  }

  function closeTaskDialog() {
    if (els.taskDialog.open) els.taskDialog.close();
  }

  function submitTaskForm(event) {
    event.preventDefault();
    saveTaskFromForm({ allowDuplicate: false });
  }

  function saveTaskFromForm(options = {}) {
    const { allowDuplicate = false } = options;
    const title = els.taskTitle.value.trim();
    const due = els.taskDate.value;
    const notes = els.taskNote.value.trim();
    const tags = normalizeTags(els.taskTags.value);
    const level = getSelectedLevel();
    const checkedStatus = els.taskForm.querySelector('input[name="status"]:checked');
    const status = checkedStatus && STATUSES.includes(checkedStatus.value) ? checkedStatus.value : "todo";

    els.taskTitle.setCustomValidity("");
    els.taskDate.setCustomValidity("");

    if (!title) {
      els.taskTitle.setCustomValidity("写一点任务内容，才能放进看板哦。");
      els.taskTitle.reportValidity();
      els.taskTitle.focus();
      return;
    }

    if (!isValidDateKey(due)) {
      els.taskDate.setCustomValidity("请选择一个有效的日期。");
      els.taskDate.reportValidity();
      els.taskDate.focus();
      return;
    }

    if (!editingId && !allowDuplicate) {
      const duplicate = state.tasks.find((task) =>
        task.due === due
        && task.title.trim().toLocaleLowerCase() === title.toLocaleLowerCase()
      );

      if (duplicate) {
        els.duplicateTaskTitle.textContent = title;
        els.duplicateDialog.showModal();
        syncModalState();
        window.requestAnimationFrame(() => els.duplicateCancel.focus());
        return;
      }
    }

    const isNewTask = !editingId;
    let savedTaskId = "";
    let newlyCompleted = false;
    let saveSucceeded = false;

    if (editingId) {
      const task = state.tasks.find((item) => item.id === editingId);
      if (!task) {
        closeTaskDialog();
        return;
      }

      const previousStatus = task.status;
      const wasDone = previousStatus === "done";
      const willBeDone = status === "done";

      if (willBeDone && !wasDone) {
        task.completedFrom = previousStatus;
        task.completedAt = Date.now();
        newlyCompleted = true;
      } else if (!willBeDone && wasDone) {
        task.completedAt = null;
        task.completedFrom = null;
      }

      task.title = title;
      task.notes = notes;
      task.due = due;
      task.status = status;
      task.level = level;
      task.tags = tags;
      savedTaskId = task.id;

      saveSucceeded = persist({ silent: true });
    } else {
      const newTask = {
        id: uid(),
        title,
        notes,
        due,
        status,
        level,
        tags,
        createdAt: Date.now(),
        completedAt: status === "done" ? Date.now() : null,
        completedFrom: status === "done" ? "todo" : null
      };

      state.tasks.push(newTask);
      savedTaskId = newTask.id;
      saveSucceeded = persist({ silent: true });
    }

    closeTaskDialog();
    resetSearchState();

    if (due !== activeDate) activeDate = due;

    renderAll();

    if (savedTaskId) {
      window.requestAnimationFrame(() => {
        const card = els.board.querySelector(`[data-id="${CSS.escape(savedTaskId)}"]`);
        if (card && card.scrollIntoView) {
          card.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      });
    }

    if (!saveSucceeded) {
      showToast("任务保存失败，请检查浏览器存储设置", { type: "error", duration: 5600 });
      return;
    }

    if (isNewTask) {
      showToast("任务保存成功", { type: "success" });
      return;
    }

    if (newlyCompleted) {
      if (isDayComplete()) {
        showToast(COMPLETE_MESSAGE, { type: "celebrate", duration: 6200 });
      } else {
        showToast("完成一件，继续向前。", { type: "success" });
      }
      return;
    }

    showToast("修改已保存", { type: "success" });
  }

  function closeDuplicateDialog() {
    if (els.duplicateDialog.open) els.duplicateDialog.close();
  }

  function confirmDuplicateTask() {
    closeDuplicateDialog();
    saveTaskFromForm({ allowDuplicate: true });
  }

  function handleDuplicateDialogClose() {
    syncModalState();
  }

  /* =========================================================
     Completion, movement & deletion
     ========================================================= */

  function announceCompletion() {
    if (isDayComplete()) {
      showToast(COMPLETE_MESSAGE, { type: "celebrate", duration: 6200 });
    } else {
      showToast("完成一件，继续向前。", { type: "success" });
    }
  }

  function toggleTask(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;

    if (task.status === "done") {
      task.status = task.completedFrom || "todo";
      task.completedAt = null;
      task.completedFrom = null;
      const saved = persist({ silent: true });
      renderAll();

      if (saved) showToast("已重新打开，慢慢来。", { type: "success" });
      else showToast("状态已更新，但本地保存失败", { type: "error" });
      return;
    }

    task.completedFrom = task.status;
    task.status = "done";
    task.completedAt = Date.now();
    justCompletedId = task.id;
    const saved = persist({ silent: true });
    renderAll();
    els.lists.done.scrollTop = 0;

    if (saved) announceCompletion();
    else showToast("任务已完成，但本地保存失败", { type: "error" });
  }

  function moveTaskToStatus(taskId, nextStatus) {
    if (!STATUSES.includes(nextStatus)) return;

    const task = state.tasks.find((item) => item.id === taskId);
    if (!task || task.status === nextStatus) return;

    const previousStatus = task.status;
    const leavingDone = previousStatus === "done";

    if (nextStatus === "done") {
      task.completedFrom = previousStatus;
      task.completedAt = Date.now();
      justCompletedId = task.id;
    } else {
      task.completedAt = null;
      task.completedFrom = null;
    }

    task.status = nextStatus;
    const saved = persist({ silent: true });
    renderAll();

    if (!saved) {
      showToast("状态已更新，但本地保存失败", { type: "error" });
      return;
    }

    if (nextStatus === "done") {
      els.lists.done.scrollTop = 0;
      announceCompletion();
    } else if (leavingDone) {
      showToast("已重新打开，慢慢来。", { type: "success" });
    } else {
      showToast(`已移到「${STATUS_LABELS[nextStatus]}」`, { type: "success" });
    }
  }

  function openDeleteDialog(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;

    pendingDeleteId = taskId;
    closeTagPopover();
    els.confirmTaskTitle.textContent = task.title;
    els.confirmDialog.showModal();
    syncModalState();
    window.requestAnimationFrame(() => {
      els.confirmCancel.focus();
    });
  }

  function closeDeleteDialog() {
    if (els.confirmDialog.open) els.confirmDialog.close();
  }

  function confirmDeleteTask() {
    if (!pendingDeleteId) {
      closeDeleteDialog();
      return;
    }

    const taskId = pendingDeleteId;
    const index = state.tasks.findIndex((item) => item.id === taskId);
    if (index === -1) {
      closeDeleteDialog();
      return;
    }

    const deletedTask = state.tasks[index];
    state.tasks.splice(index, 1);
    const saved = persist({ silent: true });
    closeDeleteDialog();
    renderAll();

    if (!saved) {
      showToast("任务已删除，但本地保存失败", { type: "error" });
      return;
    }

    showToast("任务已删除", {
      type: "success",
      action: {
        label: "撤销",
        handler: () => {
          if (state.tasks.some((item) => item.id === deletedTask.id)) return;
          state.tasks.splice(Math.min(index, state.tasks.length), 0, deletedTask);
          const restored = persist({ silent: true });
          renderAll();
          showToast(restored ? "已撤销删除" : "任务已恢复，但本地保存失败", {
            type: restored ? "success" : "error"
          });
        }
      }
    });
  }

  /* =========================================================
     Name editing
     ========================================================= */

  function beginNameEdit() {
    if (!els.nameForm.hidden) return;
    els.nameInput.value = state.profile.name || "";
    els.nameDisplay.hidden = true;
    els.nameForm.hidden = false;
    window.requestAnimationFrame(() => {
      els.nameInput.focus();
      els.nameInput.select();
    });
  }

  function cancelNameEdit() {
    els.nameForm.hidden = true;
    els.nameDisplay.hidden = false;
    els.nameInput.value = "";
    els.nameInput.setCustomValidity("");
  }

  function saveName(event) {
    event.preventDefault();
    const nextName = els.nameInput.value.trim().slice(0, 16);

    if (!nextName) {
      els.nameInput.setCustomValidity("名字不能为空哦。");
      els.nameInput.reportValidity();
      els.nameInput.focus();
      return;
    }

    state.profile.name = nextName;
    const saved = persist({ silent: true });
    els.nameInput.setCustomValidity("");
    els.nameForm.hidden = true;
    els.nameDisplay.hidden = false;
    els.nameInput.value = "";
    renderAll();

    if (saved) showToast("称呼已保存", { type: "success" });
    else showToast("称呼已更新，但本地保存失败", { type: "error" });
  }

  /* =========================================================
     Avatar & signature
     ========================================================= */

  function makeAvatarDataUrl(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        try {
          const size = 256;
          const side = Math.min(image.naturalWidth, image.naturalHeight);
          if (!side) throw new Error("empty-image");

          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const context = canvas.getContext("2d");
          if (!context) throw new Error("canvas-unavailable");

          context.fillStyle = "#0a1118";
          context.fillRect(0, 0, size, size);
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = "high";
          context.drawImage(
            image,
            Math.max(0, (image.naturalWidth - side) / 2),
            Math.max(0, (image.naturalHeight - side) / 2),
            side,
            side,
            0,
            0,
            size,
            size
          );

          let dataUrl = canvas.toDataURL("image/webp", 0.9);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          }
          if (dataUrl.length > MAX_AVATAR_CHARS) {
            dataUrl = canvas.toDataURL("image/jpeg", 0.72);
          }
          if (dataUrl.length > MAX_AVATAR_CHARS) throw new Error("avatar-too-large");

          resolve(dataUrl);
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("image-decode-failed"));
      };

      image.src = objectUrl;
    });
  }

  async function handleAvatarFile(file) {
    if (!file) return;

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("not-an-image");
      }
      if (file.size > 8 * 1024 * 1024) {
        throw new Error("image-too-big");
      }

      const avatar = await makeAvatarDataUrl(file);
      state.profile.avatar = avatar;
      const saved = persist({ silent: true });
      renderProfile();
      showToast(saved ? "头像已更换" : "头像已更新，但本地保存失败", {
        type: saved ? "success" : "error"
      });
    } catch (error) {
      const message = error?.message === "image-too-big"
        ? "图片太大，请换一张 8MB 以内的图片。"
        : "头像更新失败，请换一张图片再试。";
      showToast(message, { type: "error" });
    } finally {
      els.avatarInput.value = "";
    }
  }

  function openSignatureDialog() {
    if (els.signatureDialog.open) return;

    els.signatureInput.value = state.profile.signature || DEFAULT_SIGNATURE;
    els.signatureCnInput.value = state.profile.signatureCn || "";
    els.signatureInput.setCustomValidity("");
    els.signatureDialog.showModal();
    syncModalState();

    window.requestAnimationFrame(() => {
      els.signatureInput.focus();
      const length = els.signatureInput.value.length;
      els.signatureInput.setSelectionRange(length, length);
    });
  }

  function closeSignatureDialog() {
    if (els.signatureDialog.open) els.signatureDialog.close();
  }

  function submitSignatureForm(event) {
    event.preventDefault();
    const signature = els.signatureInput.value.trim();
    const signatureCn = els.signatureCnInput.value.trim();

    els.signatureInput.setCustomValidity("");
    if (!signature) {
      els.signatureInput.setCustomValidity("签名不能为空哦。");
      els.signatureInput.reportValidity();
      els.signatureInput.focus();
      return;
    }

    state.profile.signature = signature.slice(0, 90);
    state.profile.signatureCn = signatureCn.slice(0, 60);
    const saved = persist({ silent: true });
    closeSignatureDialog();
    renderProfile();

    if (saved) showToast("签名已保存", { type: "success" });
    else showToast("签名已更新，但本地保存失败", { type: "error" });
  }

  function handleSignatureDialogClose() {
    syncModalState();
  }

  /* =========================================================
     Toast
     ========================================================= */

  function hideToast() {
    window.clearTimeout(toastTimer);
    toastTimer = null;
    els.toast.classList.remove("is-visible");
  }

  function showToast(message, options = {}) {
    const { type = "info", action = null, duration = 4600 } = options;

    window.clearTimeout(toastTimer);
    els.toast.classList.remove("is-visible", "toast--success", "toast--error", "toast--celebrate");
    void els.toast.offsetWidth;

    els.toastMessage.textContent = message;
    els.toastIcon.textContent = type === "success" ? "✓" : type === "error" ? "!" : "✦";

    if (type !== "info") els.toast.classList.add(`toast--${type}`);

    toastActionHandler = null;

    if (action && typeof action.handler === "function") {
      els.toastAction.hidden = false;
      els.toastAction.textContent = action.label || "撤销";
      toastActionHandler = action.handler;
    } else {
      els.toastAction.hidden = true;
    }

    els.toast.style.setProperty("--toast-duration", `${duration}ms`);
    els.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(hideToast, duration);
  }

  /* =========================================================
     Event wiring
     ========================================================= */

  function bindEvents() {
    // Name editing
    els.nameDisplay.addEventListener("click", beginNameEdit);
    els.nameForm.addEventListener("submit", saveName);
    els.nameCancel.addEventListener("click", cancelNameEdit);
    els.nameInput.addEventListener("input", () => els.nameInput.setCustomValidity(""));

    // Avatar & signature
    els.avatarButton.addEventListener("click", () => els.avatarInput.click());
    els.avatarInput.addEventListener("change", () => {
      const file = els.avatarInput.files?.[0];
      if (file) handleAvatarFile(file);
    });
    els.signatureEditBtn.addEventListener("click", openSignatureDialog);
    els.signatureText.addEventListener("click", openSignatureDialog);
    els.signatureClose.addEventListener("click", closeSignatureDialog);
    els.signatureCancel.addEventListener("click", closeSignatureDialog);
    els.signatureForm.addEventListener("submit", submitSignatureForm);
    els.signatureInput.addEventListener("input", () => els.signatureInput.setCustomValidity(""));
    els.signatureDialog.addEventListener("close", handleSignatureDialogClose);
    els.signatureDialog.addEventListener("click", (event) => {
      if (event.target === els.signatureDialog) closeSignatureDialog();
    });

    // Theme controls
    els.themeLightBtn.addEventListener("click", () => changeTheme("light"));
    els.themeDarkBtn.addEventListener("click", () => changeTheme("dark"));
    els.themeSkinBtn.addEventListener("click", () => {
      showToast("更多页面皮肤正在准备中，敬请期待", { type: "info" });
    });

    // Date view
    els.dateTrigger.addEventListener("click", openDatePicker);
    els.datePicker.addEventListener("change", () => {
      const nextDate = els.datePicker.value;
      if (isValidDateKey(nextDate)) setActiveDate(nextDate);
      else els.datePicker.value = activeDate;
      els.dateTrigger.focus({ preventScroll: true });
    });
    els.todayBtn.addEventListener("click", () => {
      setActiveDate(todayKey());
    });

    // Search: keyword is one independent function, tag is another
    els.keywordInput.addEventListener("input", () => {
      keyword = els.keywordInput.value;
      els.keywordClear.hidden = keyword.length === 0;
      els.keywordInput.closest(".keyword-box").classList.toggle("has-value", keyword.length > 0);
      renderBoard({ resetScroll: true });
    });
    els.keywordInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && keyword) {
        event.preventDefault();
        event.stopPropagation();
        clearKeyword({ focus: true });
      }
    });
    els.keywordClear.addEventListener("click", () => clearKeyword({ focus: true }));
    els.tagTrigger.addEventListener("click", toggleTagPopover);
    els.tagClose.addEventListener("click", () => closeTagPopover({ returnFocus: true }));
    els.tagOptions.addEventListener("click", (event) => {
      const option = event.target.closest("[data-tag-option]");
      if (!option) return;
      const tag = option.getAttribute("data-tag-option") || null;
      selectTag(tag, { returnFocus: true });
    });
    els.clearSearchBtn.addEventListener("click", () => clearSearchFilters({ focus: true }));
    document.addEventListener("pointerdown", (event) => {
      if (els.tagPopover.hidden) return;
      if (!els.tagSearch.contains(event.target)) closeTagPopover();
    });

    // Board actions
    els.addTaskBtn.addEventListener("click", () => openTaskDialog({ status: "todo" }));
    els.board.addEventListener("click", handleBoardClick);

    // Task dialog
    els.dialogClose.addEventListener("click", closeTaskDialog);
    els.dialogCancel.addEventListener("click", closeTaskDialog);
    els.taskForm.addEventListener("submit", submitTaskForm);
    els.taskTitle.addEventListener("input", () => els.taskTitle.setCustomValidity(""));
    els.taskDate.addEventListener("input", () => els.taskDate.setCustomValidity(""));
    els.levelTrigger.addEventListener("click", () => setLevelPanel(els.levelPanel.hidden));
    els.taskForm.querySelectorAll('input[name="taskLevel"]').forEach((radio) => {
      radio.addEventListener("change", () => updateLevelPreview(Number(radio.value)));
    });
    els.taskDialog.addEventListener("close", handleTaskDialogClose);
    els.taskDialog.addEventListener("click", (event) => {
      if (event.target === els.taskDialog) closeTaskDialog();
    });

    // Delete confirmation
    els.confirmCancel.addEventListener("click", closeDeleteDialog);
    els.confirmDelete.addEventListener("click", confirmDeleteTask);
    els.confirmDialog.addEventListener("close", handleConfirmDialogClose);
    els.confirmDialog.addEventListener("click", (event) => {
      if (event.target === els.confirmDialog) closeDeleteDialog();
    });

    // Duplicate task confirmation
    els.duplicateCancel.addEventListener("click", closeDuplicateDialog);
    els.duplicateConfirm.addEventListener("click", confirmDuplicateTask);
    els.duplicateDialog.addEventListener("close", handleDuplicateDialogClose);
    els.duplicateDialog.addEventListener("click", (event) => {
      if (event.target === els.duplicateDialog) closeDuplicateDialog();
    });

    // Toast action
    els.toastAction.addEventListener("click", () => {
      const handler = toastActionHandler;
      hideToast();
      if (handler) handler();
    });

    // Drag & drop
    els.board.addEventListener("dragstart", handleDragStart);
    els.board.addEventListener("dragend", cleanupDrag);
    els.board.addEventListener("dragover", handleDragOver);
    els.board.addEventListener("dragleave", handleDragLeave);
    els.board.addEventListener("drop", handleDrop);

    // Keyboard shortcuts
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.nameForm.hidden) {
        event.preventDefault();
        cancelNameEdit();
        els.nameDisplay.focus();
        return;
      }

      if (event.key === "Escape" && !els.tagPopover.hidden) {
        event.preventDefault();
        closeTagPopover({ returnFocus: true });
        return;
      }

      if (event.key === "Escape" && els.taskDialog.open && !els.levelPanel.hidden
        && !els.duplicateDialog.open && !els.confirmDialog.open) {
        event.preventDefault();
        setLevelPanel(false);
        els.levelTrigger.focus();
        return;
      }

      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const tagName = document.activeElement?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;
      if (els.taskDialog.open || els.confirmDialog.open || els.duplicateDialog.open || els.signatureDialog.open) return;

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        openTaskDialog({ status: "todo" });
      }
    });

    // Keep multiple open tabs in sync.
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === null) {
        state = seedState();
      } else {
        try {
          state = normalizeState(JSON.parse(event.newValue));
        } catch (error) {
          return;
        }
      }
      ensureSelectedTagAvailable();
      renderAll();
    });
  }

  function handleBoardClick(event) {
    const tagButton = event.target.closest("[data-task-tag]");
    if (tagButton) {
      selectTag(tagButton.getAttribute("data-task-tag"), { returnFocus: false });
      return;
    }

    const addButton = event.target.closest("[data-add-status]");
    if (addButton) {
      const status = addButton.dataset.addStatus;
      if (STATUSES.includes(status)) openTaskDialog({ status });
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const card = actionButton.closest(".task-card");
    if (!card) return;

    const taskId = card.dataset.id;
    const action = actionButton.dataset.action;

    if (action === "toggle") toggleTask(taskId);
    else if (action === "edit") openTaskDialog({ id: taskId });
    else if (action === "delete") openDeleteDialog(taskId);
    else if (action === "to-doing") moveTaskToStatus(taskId, "doing");
    else if (action === "to-done") moveTaskToStatus(taskId, "done");
  }

  function handleTaskDialogClose() {
    editingId = null;
    setLevelPanel(false);
    els.taskForm.reset();
    els.taskTitle.setCustomValidity("");
    els.taskDate.setCustomValidity("");
    syncModalState();
  }

  function handleConfirmDialogClose() {
    if (els.confirmDialog.open) return;
    pendingDeleteId = null;
    syncModalState();
  }

  /* =========================================================
     Drag & drop
     ========================================================= */

  function handleDragStart(event) {
    const card = event.target.closest(".task-card");
    if (!card) return;

    if (event.target.closest("button")) {
      event.preventDefault();
      return;
    }

    draggedId = card.dataset.id;
    card.classList.add("is-dragging");

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      try {
        event.dataTransfer.setData("text/plain", draggedId);
      } catch (error) {
        // Some browsers restrict custom drag data; the in-memory id is enough.
      }
    }
  }

  function handleDragOver(event) {
    if (!draggedId) return;
    const column = event.target.closest(".column");
    if (!column) return;

    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";

    if (currentDropColumn !== column) {
      if (currentDropColumn) currentDropColumn.classList.remove("is-drop-target");
      currentDropColumn = column;
    }
    column.classList.add("is-drop-target");
  }

  function handleDragLeave(event) {
    const column = event.target.closest(".column");
    if (!column) return;
    if (!column.contains(event.relatedTarget)) {
      column.classList.remove("is-drop-target");
      if (currentDropColumn === column) currentDropColumn = null;
    }
  }

  function handleDrop(event) {
    const column = event.target.closest(".column");
    if (!column || !draggedId) return;

    event.preventDefault();
    const taskId = draggedId;
    const nextStatus = column.dataset.status;

    cleanupDrag();
    moveTaskToStatus(taskId, nextStatus);
  }

  function cleanupDrag() {
    draggedId = null;
    currentDropColumn = null;
    document.querySelectorAll(".is-drop-target").forEach((column) => column.classList.remove("is-drop-target"));
    document.querySelectorAll(".is-dragging").forEach((card) => card.classList.remove("is-dragging"));
  }

  /* =========================================================
     Boot
     ========================================================= */

  loadInitialState();
  activeDate = todayKey();
  bindEvents();
  renderAll();

  if (firstRun) {
    window.setTimeout(() => {
      showToast("已放入几条示例任务，可以直接编辑或删除它们。", { type: "info" });
    }, 700);
  }

  if (storageBlocked) {
    window.setTimeout(() => {
      showToast("浏览器未允许本地保存，刷新后数据可能丢失。", { type: "error" });
    }, 1500);
  }
})();
