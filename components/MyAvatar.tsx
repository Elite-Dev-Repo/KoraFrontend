import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

import avatar1 from "@/public/avatar1.jpg";
import avatar2 from "@/public/avatar2.jpg";
import avatar3 from "@/public/avatar3.jpg";
import avatar4 from "@/public/avatar4.jpg";

const avatars = [avatar1, avatar2, avatar3, avatar4];

export function MyAvatar() {
  return (
    <AvatarGroup className="grayscale-0 ">
      {avatars.map((avatar, i) => {
        return (
          <Avatar key={i}>
            <AvatarImage src={avatar.src} alt="avatar image" />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
        );
      })}
    </AvatarGroup>
  );
}
