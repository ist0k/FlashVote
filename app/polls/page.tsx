import type { Metadata } from "next";

import { MyPollsEmpty } from "@/components/poll/my-polls-empty";
import { MyPollsView } from "@/components/poll/my-polls-view";
import { getOwnedPolls } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My polls" };

export default async function MyPollsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <MyPollsEmpty />;

  const polls = await getOwnedPolls();

  return <MyPollsView polls={polls} />;
}
