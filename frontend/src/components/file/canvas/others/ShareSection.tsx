import { Button } from "../../../ui/button.tsx";
import { Share2 } from "lucide-react";
import AuthBtn from "../../../AuthBtn.tsx";

const ShareSection = () => {
  return (
    <div className={"hidden items-center gap-8 md:flex"}>
      <Button variant={"app"}>
        Share
        <Share2 size={24} />
      </Button>
      <AuthBtn />
    </div>
  );
};
export default ShareSection;
