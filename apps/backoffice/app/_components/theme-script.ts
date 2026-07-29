/**
 * Blocking inline script: set the initial theme from storage / OS preference
 * before first paint, avoiding a flash of the wrong theme.
 *
 * Kept in its own server-safe module (NO "use client") so the Server Component
 * root layout can import it. Importing it from the client `theme-toggle.tsx`
 * instead crosses the RSC boundary and throws at render ("cannot dot into a
 * client module from a server component").
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
