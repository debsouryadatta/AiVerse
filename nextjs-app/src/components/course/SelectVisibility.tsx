"use client";

import { changeVisibilityAction } from "@/app/(inner_routes)/course/[...slug]/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function SelectVisibility({ course }: { course: any }) {
  const session = useSession();

  const changeVisibility = async (visibility: string) => {
    try {
      const result = await changeVisibilityAction(
        course.id,
        session?.data?.user?.id!,
        visibility
      );
      toast.success(`Visibility changed to ${visibility} successfully`);
    } catch (error) {
      console.log("Error", error);
      toast.error("Error changing visibility");
    }
  };

  return (
    <Select onValueChange={changeVisibility}>
      <SelectTrigger
        disabled={course?.userId !== session?.data?.user?.id}
        className="w-[180px] dark:bg-zinc-950"
      >
        <SelectValue
          placeholder={
            course?.visibility == "invite-only" ? "Invite Only" : "Public"
          }
        />
      </SelectTrigger>
      <SelectContent
        className="dark:bg-zinc-950"
      >
        <SelectItem value="public">Make It Public</SelectItem>
        <SelectItem value="invite-only">Make It Invite Only</SelectItem>
      </SelectContent>
    </Select>
  );
}
