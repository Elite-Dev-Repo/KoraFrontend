"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Books01Icon, LayoutRightIcon } from "@hugeicons/core-free-icons";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  LoaderCircle,
  LogOut,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { ACCESS, REFRESH } from "@/api/constants";
import { cn } from "@/lib/utils";
import { FetchUserProfile } from "@/api/profile-api";
import { GenerateUserContext } from "@/api/context-api";
import { CreateApiKey, FetchApiKeys, RevokeApiKey } from "@/api/apikey-api";
import { clearToken } from "@/api/auth-api";

type Section = "profile" | "context" | "keys";

type ApiKeyItem = {
  id: number;
  name: string;
  prefix: string;
  created_at: string;
  is_active: boolean;
  // Raw key exists ONLY in the POST response, shown once after creation.
  key?: string;
};

type Education = {
  institution: string;
  field: string;
  duration: string;
};

type Project = {
  Title: string;
  details: string;
  stack: string[];
};

type ContactInfo = {
  medium: string;
  information: string;
};

type UserInfoDetail = {
  user: number;
  full_name: string;
  user_information: string;
  projects: Project[];
  education: Education | Education[] | null;
  skills: string[];
  hobbies: string[];
  contact_information: ContactInfo[];
};

type UserProfile = {
  id: number;
  email: string;
  gender: string;
  user_info: UserInfoDetail | null;
};

const SECTIONS: {
  id: Section;
  label: string;
  blurb: string;
  icon: typeof User;
}[] = [
  {
    id: "profile",
    label: "User Information",
    blurb: "Account & session",
    icon: User,
  },
  {
    id: "context",
    label: "Create Context",
    blurb: "Teach Kora about you",
    icon: FileText,
  },
  {
    id: "keys",
    label: "API Keys",
    blurb: "Keys for your sites",
    icon: KeyRound,
  },
];

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function subscribeAuth(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("kora-auth-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("kora-auth-change", onChange);
  };
}

function readAccessToken(): string | null {
  return localStorage.getItem(ACCESS);
}

export default function DashboardPage() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("profile");
  const [collapsed, setCollapsed] = useState<boolean>(() =>
    readJSON<boolean>("kora-sidebar-collapsed", false),
  );

  useEffect(() => {
    try {
      localStorage.setItem("kora-sidebar-collapsed", JSON.stringify(collapsed));
    } catch {
      // storage full / unavailable — non-fatal
    }
  }, [collapsed]);

  // Track the access token; redirect when it disappears (client-side navigation
  // via useRouter, per the Next.js redirecting guide).
  const accessToken = useSyncExternalStore(
    subscribeAuth,
    readAccessToken,
    () => null,
  );

  // On a refresh, the first client render still holds the server snapshot
  // (null) for hydration. Only trust the token value after hydration
  // finishes, otherwise the redirect below fires with a stale null and
  // bounces logged-in users to /auth.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isMounted && accessToken === null) {
      router.replace("/auth");
    }
  }, [isMounted, accessToken, router]);

  const tokenInfo = useMemo(() => {
    if (!accessToken) return null;
    try {
      return jwtDecode<Record<string, unknown>>(accessToken);
    } catch {
      return null;
    }
  }, [accessToken]);

  // User profile from GET profile/
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileStatus, setProfileStatus] = useState<
    "loading" | "error" | "ready"
  >("loading");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileAttempt, setProfileAttempt] = useState(0);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  useEffect(() => {
    if (!isMounted || !accessToken) return;
    let cancelled = false;

    FetchUserProfile().then(
      (data) => {
        if (cancelled) return;
        setProfile(data as UserProfile);
        setProfileError(null);
        setProfileStatus("ready");
      },
      (err: unknown) => {
        if (cancelled) return;
        const data = err as Record<string, unknown>;
        // Expired/invalid token — clear session; the auth subscription
        // redirects to /auth.
        if (
          data?.code === "token_not_valid" ||
          (typeof data?.detail === "string" &&
            /token|authenticat|credentials/i.test(data.detail))
        ) {
          clearToken();
          window.dispatchEvent(new Event("kora-auth-change"));
          toast.error("Session expired — please log in again.");
          return;
        }
        const message =
          typeof data?.detail === "string"
            ? data.detail
            : "Could not load your profile.";
        setProfileError(message);
        setProfileStatus("error");
        toast.error(message);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [isMounted, accessToken, profileAttempt]);

  const retryProfile = () => {
    setProfileError(null);
    setProfileStatus("loading");
    setProfileAttempt((n) => n + 1);
  };

  // Create Context state — wired to POST generate_info/ (multipart:
  // personal_context + past_projects text + resume PDF). On success the
  // backend extracts/saves UserInfo and we refresh the profile view.
  const [personalContext, setPersonalContext] = useState("");
  const [pastProjects, setPastProjects] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [ctxSaving, setCtxSaving] = useState(false);

  // API Keys state — backed by GET/POST/DELETE api-keys/
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [keysStatus, setKeysStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [keysError, setKeysError] = useState<string | null>(null);
  const [keysAttempt, setKeysAttempt] = useState(0);
  const [keyName, setKeyName] = useState("");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isMounted || !accessToken) return;
    let cancelled = false;
    setKeysStatus("loading");
    setKeysError(null);

    FetchApiKeys().then(
      (data) => {
        if (cancelled) return;
        setApiKeys(data as ApiKeyItem[]);
        setKeysStatus("ready");
      },
      (err: unknown) => {
        if (cancelled) return;
        const data = err as Record<string, unknown>;
        const message =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.name)
              ? String(data.name[0])
              : "Could not load your API keys.";
        setKeysError(message);
        setKeysStatus("error");
      },
    );

    return () => {
      cancelled = true;
    };
  }, [isMounted, accessToken, keysAttempt]);

  if (!isMounted || accessToken === null) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-background">
        <LoaderCircle className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = () => {
    clearToken();
    window.dispatchEvent(new Event("kora-auth-change"));
    router.replace("/auth");
  };

  const handleSaveContext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalContext.trim() && !pastProjects.trim() && !resumeFile) {
      toast.error("Add some context, past projects, or upload your resume.");
      return;
    }
    if (resumeFile) {
      if (resumeFile.type !== "application/pdf") {
        toast.error("Resume must be a PDF file.");
        return;
      }
      if (resumeFile.size > 10 * 1024 * 1024) {
        toast.error("Resume file too large. Max 10MB.");
        return;
      }
    }
    setCtxSaving(true);
    try {
      const data = await GenerateUserContext({
        personalContext: personalContext.trim(),
        pastProjects: pastProjects.trim(),
        resumeFile,
      });
      const updatedProfile =
        (data as { profile?: UserProfile })?.profile ?? null;
      if (updatedProfile) {
        setProfile(updatedProfile);
        setProfileStatus("ready");
        setProfileError(null);
      } else {
        // Fallback: refetch profile so User Information reflects saved context
        retryProfile();
      }
      setPersonalContext("");
      setPastProjects("");
      setResumeFile(null);
      toast.success((data as { detail?: string })?.detail ?? "Context saved!");
      setSection("profile");
    } catch (err: unknown) {
      const data = err as Record<string, unknown>;
      const message =
        typeof data?.detail === "string"
          ? data.detail
          : "Could not save context. Try again.";
      toast.error(message);
    } finally {
      setCtxSaving(false);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      toast.error("Name your API key first (e.g. My website).");
      return;
    }
    setGeneratingKey(true);
    try {
      const data = (await CreateApiKey(keyName.trim())) as ApiKeyItem;
      setApiKeys((prev) => [data, ...prev]);
      setRevealed((prev) => ({ ...prev, [data.id]: true }));
      setKeyName("");
      toast.success(
        "API key generated — copy it now, it won't be shown again!",
      );
    } catch (err: unknown) {
      const data = err as Record<string, unknown>;
      const message =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.name)
            ? String(data.name[0])
            : "Could not generate key. Try again.";
      toast.error(message);
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleRevokeKey = async (item: ApiKeyItem) => {
    try {
      await RevokeApiKey(item.id);
      setApiKeys((prev) => prev.filter((x) => x.id !== item.id));
      toast.success("API key revoked.");
    } catch {
      toast.error("Could not revoke key. Try again.");
    }
  };

  const handleCopy = async (item: ApiKeyItem) => {
    if (!item.key) {
      toast.error("Full key is only shown once, right after creation.");
      return;
    }
    try {
      await navigator.clipboard.writeText(item.key);
      setCopiedId(item.id);
      toast.success("API key copied to clipboard!");
      setTimeout(
        () => setCopiedId((cur) => (cur === item.id ? null : cur)),
        1500,
      );
    } catch {
      toast.error("Could not copy — select and copy it manually.");
    }
  };

  const expiresAt =
    typeof tokenInfo?.exp === "number"
      ? new Date(tokenInfo.exp * 1000).toLocaleString()
      : null;
  const displayName =
    profile?.user_info?.full_name?.trim() || profile?.email || "Signed in";
  const initial = (displayName[0] ?? "K").toUpperCase();
  const rawEducation = profile?.user_info?.education;
  const educationItems: Education[] = Array.isArray(rawEducation)
    ? rawEducation
    : rawEducation
      ? [rawEducation]
      : [];
  const projects = profile?.user_info?.projects ?? [];

  return (
    <div className="h-dvh w-full overflow-hidden bg-background p-4 md:p-6 flex flex-col lg:flex-row gap-4">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 flex-col rounded-3xl bg-secondary border border-secondary/10 shadow-sm p-4 transition-all duration-300",
          collapsed ? "w-20" : "w-72",
        )}
      >
        <div
          className={cn(
            "flex items-center py-3",
            collapsed ? "justify-center" : "justify-between px-2",
          )}
        >
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3 text-background">
              <HugeiconsIcon icon={Books01Icon} />
              <span className="text-lg font-medium tracking-wider">Kora</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex size-9 items-center justify-center rounded-full hover:bg-secondary/5 text-background transition-colors"
          >
            <span
              className={cn(
                "flex transition-transform duration-300",
                collapsed && "rotate-180",
              )}
            >
              <HugeiconsIcon icon={LayoutRightIcon} />
            </span>
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1.5">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                title={collapsed ? s.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors focus:outline-none",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-secondary text-background"
                    : "hover:bg-secondary/5 text-background",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <span>
                    <span className="block text-sm font-semibold leading-tight">
                      {s.label}
                    </span>
                    <span
                      className={cn(
                        "block text-[11px] leading-tight",
                        active ? "text-background/70" : "text-gray-400",
                      )}
                    >
                      {s.blurb}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          {collapsed ? (
            <button
              type="button"
              onClick={handleLogout}
              title={profile?.email ?? "Log out"}
              aria-label="Log out"
              className="w-full flex items-center justify-center rounded-2xl border border-gray-200 px-0 py-2.5 text-background hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <div className="w-full flex items-center gap-2.5 \px-3 py-2.5">
              <div className="size-8 shrink-0 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {initial}
              </div>
              <p className="flex-1 min-w-0 truncate text-xs font-medium text-background">
                {profile?.email ?? "…"}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="shrink-0 text-background/60 hover:text-background transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between rounded-3xl bg-white border border-secondary/10 shadow-sm px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <HugeiconsIcon icon={Books01Icon} />
          <span className="text-lg font-medium tracking-wider">Kora</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="flex size-9 items-center justify-center rounded-full bg-secondary/5 text-background"
        >
          <LogOut className="size-4" />
        </button>
      </header>

      {/* Mobile section pills */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-secondary text-background"
                  : "bg-white border border-secondary/10 text-background",
              )}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-0 overflow-y-auto rounded-3xl bg-white border border-secondary/10 shadow-sm p-6 md:p-10">
        {section === "profile" && (
          <section className="w-full">
            <h1 className="text-2xl font-bold text-gray-900">
              User Information
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your account and profile details.
            </p>

            {profileStatus === "loading" ? (
              <div className="mt-6 space-y-3 animate-pulse">
                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
                  <div className="size-14 shrink-0 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-24 rounded-2xl bg-gray-50" />
                <div className="h-12 rounded-xl bg-gray-50" />
              </div>
            ) : profileStatus === "error" || !profile ? (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm">
                <p className="font-semibold text-red-700">
                  {profileError ?? "Could not load your profile."}
                </p>
                <button
                  type="button"
                  onClick={retryProfile}
                  className="mt-3 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="mt-6 flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
                  <div className="size-14 shrink-0 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {profile.email}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {profile.gender && (
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                          {profile.gender}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {profile.user_info?.user_information && (
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    {profile.user_info.user_information}
                  </p>
                )}

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3">
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium text-gray-900 truncate">
                      {profile.email}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3">
                    <dt className="text-gray-500">Gender</dt>
                    <dd className="font-medium text-gray-900">
                      {profile.gender || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3">
                    <dt className="text-gray-500">Token expires</dt>
                    <dd className="font-medium text-gray-900">
                      {expiresAt ?? "—"}
                    </dd>
                  </div>
                </dl>

                {educationItems.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-sm font-bold text-gray-900">
                      Education
                    </h2>
                    <div className="mt-2 space-y-2">
                      {educationItems.map((edu, i) => (
                        <div
                          key={`${edu.institution}-${i}`}
                          className="rounded-xl border border-gray-100 px-4 py-3"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {edu.field}
                          </p>
                          <p className="text-xs text-gray-500">
                            {edu.institution}
                            {edu.duration ? ` · ${edu.duration}` : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {projects.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-sm font-bold text-gray-900">
                      Projects
                      <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                        {projects.length}
                      </span>
                    </h2>
                    <div className="mt-2 space-y-3">
                      {projects.map((project, i) => {
                        const expanded = expandedProject === i;
                        const long =
                          project.details && project.details.length > 220;
                        return (
                          <div
                            key={`${project.Title}-${i}`}
                            className="rounded-2xl border border-gray-100 p-4"
                          >
                            <p className="text-sm font-semibold text-gray-900">
                              {project.Title}
                            </p>
                            <p
                              className={cn(
                                "mt-1.5 text-sm text-gray-600 leading-relaxed",
                                !expanded && "line-clamp-3",
                              )}
                            >
                              {project.details}
                            </p>
                            {long && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedProject(expanded ? null : i)
                                }
                                className="mt-1.5 text-xs font-semibold text-blue-600 hover:underline focus:outline-none"
                              >
                                {expanded ? "Show less" : "Show more"}
                              </button>
                            )}
                            {project.stack?.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {project.stack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {profile.user_info?.skills?.length ? (
                  <div className="mt-6">
                    <h2 className="text-sm font-bold text-gray-900">Skills</h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {profile.user_info.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-secondary/5 border border-secondary/10 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {profile.user_info?.hobbies?.length ? (
                  <div className="mt-6">
                    <h2 className="text-sm font-bold text-gray-900">Hobbies</h2>
                    <ul className="mt-2 space-y-1.5">
                      {profile.user_info.hobbies.map((hobby) => (
                        <li
                          key={hobby}
                          className="rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-600"
                        >
                          {hobby}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {profile.user_info?.contact_information?.length ? (
                  <div className="mt-6">
                    <h2 className="text-sm font-bold text-gray-900">
                      Contact Information
                    </h2>
                    <dl className="mt-2 space-y-2 text-sm">
                      {profile.user_info.contact_information.map((c, i) => (
                        <div
                          key={`${c.medium}-${i}`}
                          className="flex justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3"
                        >
                          <dt className="text-gray-500">
                            {c.medium || "Contact"}
                          </dt>
                          <dd className="font-medium text-gray-900 truncate">
                            {c.information}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}
              </>
            )}
          </section>
        )}

        {section === "context" && (
          <section className="w-full">
            <h1 className="text-2xl font-bold text-gray-900">Create Context</h1>
            <p className="text-sm text-gray-500 mt-1">
              Tell Kora about yourself, add past projects, and upload your
              resume PDF. It will be read and saved to your profile.
            </p>

            <form onSubmit={handleSaveContext} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-background mb-1">
                  Your context
                </label>
                <textarea
                  value={personalContext}
                  onChange={(e) => setPersonalContext(e.target.value)}
                  placeholder="e.g. I'm a Philosophy graduate turned full-stack developer based in Lagos..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all text-sm text-gray-900 placeholder-gray-400 resize-y"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {personalContext.length} characters
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-background mb-1">
                  Past projects
                </label>
                <textarea
                  value={pastProjects}
                  onChange={(e) => setPastProjects(e.target.value)}
                  placeholder="e.g. Built a portfolio site with Next.js, a Django REST API for..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all text-sm text-gray-900 placeholder-gray-400 resize-y"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {pastProjects.length} characters
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-background mb-1">
                  Resume (PDF, max 10MB)
                </label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:opacity-90"
                />
                {resumeFile && (
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Selected: {resumeFile.name} (
                    {(resumeFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={ctxSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-5 py-3 text-sm font-medium text-white transition-colors"
              >
                {ctxSaving ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {ctxSaving ? "Reading & saving..." : "Save context"}
              </button>
            </form>

            {profile?.user_info?.user_information ? (
              <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-4">
                <p className="text-xs font-bold text-green-800">
                  Saved context preview
                </p>
                <p className="mt-1 text-sm text-green-900 line-clamp-4">
                  {profile.user_info.user_information}
                </p>
              </div>
            ) : (
              <p className="mt-8 text-sm text-gray-400">
                No saved context yet — fill the form above and save.
              </p>
            )}
          </section>
        )}

        {section === "keys" && (
          <section className="w-full">
            <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
            <p className="text-sm text-gray-500 mt-1">
              Generate keys to embed Kora on your websites. Treat them like
              passwords.
            </p>

            <form
              onSubmit={handleGenerateKey}
              className="mt-6 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Key name — e.g. My portfolio site"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={generatingKey}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-5 py-3 text-sm font-medium text-white transition-colors"
              >
                {generatingKey ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {generatingKey ? "Generating..." : "Generate key"}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {keysStatus === "loading" ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-20 rounded-2xl bg-gray-50" />
                  <div className="h-20 rounded-2xl bg-gray-50" />
                </div>
              ) : keysStatus === "error" ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm">
                  <p className="font-semibold text-red-700">
                    {keysError ?? "Could not load your API keys."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setKeysAttempt((n) => n + 1)}
                    className="mt-3 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    Try again
                  </button>
                </div>
              ) : apiKeys.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No API keys yet — generate one above.
                </p>
              ) : (
                apiKeys.map((k) => (
                  <div
                    key={k.id}
                    className="rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {k.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {k.prefix}... ·{" "}
                          {new Date(k.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Revoke ${k.name}`}
                        onClick={() => handleRevokeKey(k)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {k.key ? (
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold text-amber-700">
                          Copy it now — this full key won&apos;t be shown again.
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
                          <code className="flex-1 min-w-0 truncate text-xs text-secondary/90">
                            {revealed[k.id] ? k.key : "•".repeat(24)}
                          </code>
                          <button
                            type="button"
                            aria-label={
                              revealed[k.id] ? "Hide key" : "Show key"
                            }
                            onClick={() =>
                              setRevealed((prev) => ({
                                ...prev,
                                [k.id]: !prev[k.id],
                              }))
                            }
                            className="text-gray-400 hover:text-background transition-colors"
                          >
                            {revealed[k.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label="Copy key"
                            onClick={() => handleCopy(k)}
                            className="text-gray-400 hover:text-background transition-colors"
                          >
                            {copiedId === k.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                        <code className="flex-1 min-w-0 truncate text-xs text-gray-500">
                          {k.prefix}•••••••••••• (hidden — shown once at
                          creation)
                        </code>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
