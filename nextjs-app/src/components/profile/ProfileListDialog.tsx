import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileListCard from "./ProfileListCard";
import { useFollowersStore, useFollowingStore } from "@/store";

export default function ProfileListDialog({
  type,
}: {
  type: "followersList" | "followingList";
}) {
  const { followers } = useFollowersStore();
  const { following } = useFollowingStore();
  return (
    <Dialog>
      <DialogTrigger>
        {type === "followersList" ? (
          <>
            <p>{followers.length}</p>
            <p>Followers</p>
          </>
        ) : (
          <>
            <p>{following.length}</p>
            <p>Following</p>
          </>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-950">
        {type === "followersList" ? (
          <ProfileListCard users={followers} />
        ) : (
          <ProfileListCard users={following} />
        )}
      </DialogContent>
    </Dialog>
  );
}
