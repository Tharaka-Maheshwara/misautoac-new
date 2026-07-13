"use client";

import CustomerFeedbackForm from "@/components/forms/CustomerFeedbackForm";
import { useAuth } from "@/context/AuthContext";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function FeedbackPage() {
  const { user } = useAuth();

  return (
    <main className="flex flex-1 flex-col w-full">
      {user ? (
        <CustomerFeedbackForm />
      ) : (
        <div className="bg-slate-50 py-16 md:py-24 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <UserCircleIcon className="mx-auto h-16 w-16 text-slate-400" />
            <h2 className="mt-6 text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Please Log In to Leave Feedback
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              We value your opinion, but you must be logged into your account to
              submit a review. Please{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                log in
              </Link>
              {' '}to continue.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
