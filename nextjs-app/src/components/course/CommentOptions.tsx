import {
    Cloud,
    CreditCard,
    EllipsisVertical,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Pencil,
    Plus,
    PlusCircle,
    Settings,
    Trash,
    User,
    UserPlus,
    Users,
  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  export function CommentOptions({deleteComment, commentId}: {deleteComment: any, commentId: any}) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* <Button variant="outline">Open</Button> */}
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 dark:bg-zinc-950">
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
          <DropdownMenuGroup>
            {/* <DropdownMenuItem className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit comment</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={()=> deleteComment(commentId)} className="cursor-pointer">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete comment</span>
              {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  