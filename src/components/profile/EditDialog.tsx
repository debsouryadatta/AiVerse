import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useFollowersStore, useFollowingStore } from "@/store";

export default function EditDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <button className="w-[50vw] block mx-auto rounded-full bg-gray-900 dark:bg-gray-300 hover:shadow-2xl dark:hover:shadow-gray-300/30 font-semibold text-white dark:text-gray-900 px-6 py-2">
          Edit Profile
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950"></DialogContent>
    </Dialog>
  );
}
