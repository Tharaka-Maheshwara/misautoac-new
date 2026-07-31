"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  type User,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserProfileDocument {
  uid?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  role?: string;
  createdAt?: unknown;
}

type Notice = {
  type: "success" | "error" | "info";
  message: string;
} | null;

const inputClassName =
  "mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
    0,
  )}`.toUpperCase();
};

const formatAccountDate = (value: unknown) => {
  if (!value) return "Not available";

  let date: Date | null = null;

  if (value instanceof Date) {
    date = value;
  } else if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    date = (value as { toDate: () => Date }).toDate();
  } else if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as { seconds?: unknown }).seconds === "number"
  ) {
    date = new Date((value as { seconds: number }).seconds * 1000);
  }

  if (!date || Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getFirebaseErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong while updating your profile. Please try again.";
  }

  const messages: Record<string, string> = {
    "auth/invalid-credential":
      "Your current password is incorrect. Please check it and try again.",
    "auth/wrong-password":
      "Your current password is incorrect. Please check it and try again.",
    "auth/requires-recent-login":
      "For your security, please sign out, sign in again and retry this change.",
    "auth/email-already-in-use":
      "That email address is already connected to another account.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password":
      "Your new password is too weak. Use at least 8 characters.",
    "auth/too-many-requests":
      "Too many attempts were made. Please wait a moment and try again.",
    "auth/network-request-failed":
      "The network request failed. Please check your connection.",
    "auth/unauthorized-continue-uri":
      "This website domain must be added to Firebase Authorized domains.",
    "permission-denied":
      "Your Firestore security rules do not allow this profile update.",
  };

  return messages[error.code] ?? error.message;
};

export default function ProfilePage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [role, setRole] = useState("User");
  const [createdAt, setCreatedAt] = useState("Not available");
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const isPasswordAccount = useMemo(
    () =>
      firebaseUser?.providerData.some(
        (provider) => provider.providerId === "password",
      ) ?? false,
    [firebaseUser],
  );

  const providerLabel = useMemo(() => {
    if (!firebaseUser) return "Firebase";

    const providers = firebaseUser.providerData.map(
      (provider) => provider.providerId,
    );

    if (providers.includes("google.com")) return "Google";
    if (providers.includes("password")) return "Email & Password";
    return "Firebase";
  }, [firebaseUser]);

  const loadProfile = useCallback(async (currentUser: User) => {
    setIsPageLoading(true);
    setNotice(null);

    try {
      const profileReference = doc(db, "Users", currentUser.uid);
      const profileSnapshot = await getDoc(profileReference);
      const profile = profileSnapshot.exists()
        ? (profileSnapshot.data() as UserProfileDocument)
        : null;

      setProfileExists(profileSnapshot.exists());
      setDisplayName(profile?.displayName || currentUser.displayName || "");
      setEmail(currentUser.email || profile?.email || "");
      setPhotoURL(profile?.photoURL || currentUser.photoURL || "");
      setRole(profile?.role || "User");
      setCreatedAt(formatAccountDate(profile?.createdAt));
      setImageLoadFailed(false);

      // Keep the Firestore email synchronized after a verified email change.
      if (
        profileSnapshot.exists() &&
        currentUser.email &&
        profile?.email !== currentUser.email
      ) {
        try {
          await setDoc(
            profileReference,
            {
              email: currentUser.email,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          );
        } catch (syncError) {
          console.error("Could not synchronize the profile email:", syncError);
        }
      }
    } catch (loadError) {
      console.error("Could not load the user profile:", loadError);
      setNotice({
        type: "error",
        message: "We couldn't load your profile information. Please try again.",
      });
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setFirebaseUser(null);
        setIsPageLoading(false);
        router.replace("/auth/login");
        return;
      }

      setFirebaseUser(currentUser);
      void loadProfile(currentUser);
    });

    return unsubscribe;
  }, [loadProfile, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    const currentUser = auth.currentUser;
    const cleanName = displayName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const wantsEmailChange =
      isPasswordAccount && cleanEmail !== (currentUser?.email || "");
    const wantsPasswordChange = Boolean(newPassword || confirmPassword);

    if (!currentUser) {
      setNotice({
        type: "error",
        message: "Your session has ended. Please sign in again.",
      });
      return;
    }

    if (cleanName.length < 2) {
      setNotice({
        type: "error",
        message: "Please enter a full name with at least 2 characters.",
      });
      return;
    }

    if (isPasswordAccount && !cleanEmail) {
      setNotice({
        type: "error",
        message: "Please enter your email address.",
      });
      return;
    }

    if (wantsPasswordChange) {
      if (newPassword.length < 8) {
        setNotice({
          type: "error",
          message: "Your new password must contain at least 8 characters.",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setNotice({
          type: "error",
          message: "The new password and confirmation do not match.",
        });
        return;
      }
    }

    if ((wantsEmailChange || wantsPasswordChange) && !currentPassword) {
      setNotice({
        type: "error",
        message:
          "Enter your current password to change your email or password.",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (wantsEmailChange || wantsPasswordChange) {
        if (!currentUser.email) {
          throw new Error("The current account has no email address.");
        }

        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword,
        );
        await reauthenticateWithCredential(currentUser, credential);
      }

      await updateProfile(currentUser, {
        displayName: cleanName,
      });

      const profileData: Record<string, unknown> = {
        uid: currentUser.uid,
        displayName: cleanName,
        email: currentUser.email || cleanEmail,
        updatedAt: serverTimestamp(),
      };

      if (!profileExists) {
        profileData.role = "User";
        profileData.createdAt = serverTimestamp();
      }

      await setDoc(doc(db, "Users", currentUser.uid), profileData, {
        merge: true,
      });

      if (wantsPasswordChange) {
        await updatePassword(currentUser, newPassword);
      }

      if (wantsEmailChange) {
        await verifyBeforeUpdateEmail(currentUser, cleanEmail);
      }

      await currentUser.reload();
      setFirebaseUser(auth.currentUser);
      setDisplayName(cleanName);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setImageLoadFailed(false);

      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: {
            displayName: cleanName,
          },
        }),
      );

      setNotice({
        type: wantsEmailChange ? "info" : "success",
        message: wantsEmailChange
          ? `Your profile was saved. A verification link was sent to ${cleanEmail}. Your email will change after you verify it.`
          : wantsPasswordChange
            ? "Your profile and password were updated successfully."
            : "Your profile was updated successfully.",
      });
    } catch (saveError) {
      console.error("Could not update the user profile:", saveError);
      setNotice({
        type: "error",
        message: getFirebaseErrorMessage(saveError),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isPageLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-5 w-32 rounded-full bg-slate-200" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
            <div className="h-[480px] rounded-[2rem] bg-slate-200" />
            <div className="h-[620px] rounded-[2rem] bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (!firebaseUser) return null;

  const initials = getInitials(displayName || firebaseUser.email || "User");

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl text-sm font-bold text-slate-500 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700">
              <UserCircleIcon className="h-4 w-4" />
              My account
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Profile settings
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage your personal information and account security.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Account active
          </span>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] lg:sticky lg:top-24">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 text-white">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/25 blur-3xl" />

              <div className="relative">
                <div className="relative h-24 w-24">
                  {photoURL && !imageLoadFailed ? (
                    // A regular image is used so Firebase/Google photo URLs do
                    // not require an extra Next.js remotePatterns entry.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoURL}
                      alt={`${displayName || "User"} profile`}
                      className="h-full w-full rounded-[1.75rem] object-cover ring-4 ring-white/15"
                      onError={() => setImageLoadFailed(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-black shadow-xl ring-4 ring-white/15">
                      {initials}
                    </div>
                  )}

                  <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl border-4 border-slate-900 bg-white text-blue-600">
                    <CameraIcon className="h-4 w-4" />
                  </span>
                </div>

                <h2 className="mt-5 truncate text-xl font-extrabold">
                  {displayName || "Your name"}
                </h2>
                <p className="mt-1 truncate text-sm text-slate-300">
                  {firebaseUser.email}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold ring-1 ring-white/15">
                    {role}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold ring-1 ring-white/15">
                    {providerLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Member since
                </p>
                <p className="mt-1.5 text-sm font-bold text-slate-800">
                  {createdAt}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  User ID
                </p>
                <p className="mt-1.5 truncate font-mono text-xs font-semibold text-slate-600">
                  {firebaseUser.uid}
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-blue-800 ring-1 ring-blue-100">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-xs leading-5">
                  Your role, user ID and account creation date are protected and
                  cannot be edited here.
                </p>
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="space-y-6">
            {notice && (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                  notice.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : notice.type === "info"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
                role={notice.type === "error" ? "alert" : "status"}
              >
                {notice.type === "error" ? (
                  <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5 shrink-0" />
                )}
                <p className="font-semibold leading-5">{notice.message}</p>
              </div>
            )}

            <section className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.4)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <UserCircleIcon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Personal information
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Update the details displayed on your account.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold text-slate-700">
                    Full name
                  </span>
                  <span className="relative block">
                    <UserCircleIcon className="pointer-events-none absolute left-4 top-1/2 mt-1 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className={`${inputClassName} pl-12`}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      maxLength={80}
                      disabled={isSaving}
                      required
                    />
                  </span>
                </label>

                <label className="block sm:col-span-2">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-700">
                      Email address
                    </span>
                    {!isPasswordAccount && (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Managed by {providerLabel}
                      </span>
                    )}
                  </span>
                  <span className="relative block">
                    <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 mt-1 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={`${inputClassName} pl-12`}
                      placeholder="name@example.com"
                      autoComplete="email"
                      disabled={isSaving || !isPasswordAccount}
                      required
                    />
                  </span>
                  {isPasswordAccount &&
                    email.trim().toLowerCase() !==
                      (firebaseUser.email || "").toLowerCase() && (
                      <p className="mt-2 text-xs leading-5 text-blue-600">
                        A verification link will be sent to the new address
                        before the email is changed.
                      </p>
                    )}
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.4)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                  <KeyIcon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Account security
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Change your password or confirm sensitive updates.
                  </p>
                </div>
              </div>

              {isPasswordAccount ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold text-slate-700">
                      Current password
                    </span>
                    <span className="relative block">
                      <KeyIcon className="pointer-events-none absolute left-4 top-1/2 mt-1 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        className={`${inputClassName} px-12`}
                        placeholder="Required for email or password changes"
                        autoComplete="current-password"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword((current) => !current)
                        }
                        className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 rounded-md text-slate-400 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label={
                          showCurrentPassword
                            ? "Hide current password"
                            : "Show current password"
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      New password
                    </span>
                    <span className="relative block">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className={`${inputClassName} pr-12`}
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword((current) => !current)
                        }
                        className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 rounded-md text-slate-400 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      Confirm new password
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className={inputClassName}
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                      disabled={isSaving}
                    />
                  </label>
                </div>
              ) : (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Password managed by {providerLabel}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Change your password and primary email through your
                      connected {providerLabel} account.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <div className="flex flex-col-reverse gap-3 rounded-[1.75rem] border border-slate-200/70 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => void loadProfile(firebaseUser)}
                disabled={isSaving}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Reset changes
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex min-w-40 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {isSaving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}