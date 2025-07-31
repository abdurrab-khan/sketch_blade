import ZoomBtn from "./whiteboard/others/ZoomBtn";
import UndoBtn from "./whiteboard/others/UndoBtn";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const Footer = () => {
  return (
    <div className={"relative z-50 h-12 w-full pointer-events-none"}>
      <div
        className={"hidden size-full items-center justify-end gap-4 md:flex"}
      >
        <ZoomBtn />
        <UndoBtn />
      </div>
      <div className={"flex size-full rounded-lg bg-secondary p-2 md:hidden"}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size={"icon"}>
              <MenuIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-muted-foreground text-sm">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    defaultValue="100%"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxWidth">Max. width</Label>
                  <Input
                    id="maxWidth"
                    defaultValue="300px"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    defaultValue="25px"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxHeight">Max. height</Label>
                  <Input
                    id="maxHeight"
                    defaultValue="none"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
