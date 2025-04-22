import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

function Home() {
  // Make sure the user is logged in
  const {
    data: session,
    isPending, //loading state
  } = authClient.useSession();

  if (isPending) {
    return (
      <section className="min-h-screen min-w-screen">
        <article className="flex flex-col gap-2 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </article>
      </section>
    );
  }

  // If the user is not logged in...
  if (!session) {
    // ...redirect to the auth page
    redirect("/auth");
  }

  // Otherwise...
  // ...redirect to the dashboard page
  redirect("/dashboard");
}

export default Home;
