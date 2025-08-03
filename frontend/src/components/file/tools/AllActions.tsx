import React, { useCallback, useMemo } from "react";
import ToolActionsProperties, { IToolBarPropertiesValue } from "./const.ts";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import { updateToolBarProperties, updateExistingShapes } from "../../../redux/slices/appSlice.ts";
import { AllToolBarProperties } from "@/types/tools/tool.ts";
import { getShapeProperties } from "@/utils/ShapeUtils.ts";
import { AllToolBarPropertiesKeys } from "@/types/tools/common.ts";

interface ContainerProps {
  children: React.ReactNode;
  label: string;
}

interface MainToggleGroup {
  toolKey: AllToolBarPropertiesKeys
}

const Container: React.FC<ContainerProps> = ({ children, label }) => {
  return (
    <div className={"flex flex-col gap-y-2"}>
      <span>
        <p className={"text-xs font-medium"}>{label}</p>
      </span>
      <div className={"flex flex-wrap gap-2"}>{children}</div>
    </div>
  );
};

const ToolItem = ({ propsValue }: { propsValue: IToolBarPropertiesValue | string }) => {
  const value = typeof propsValue === "string" ? propsValue : propsValue.value

  return (
    <ToggleGroupItem
      name="tools"
      value={value}
      aria-label={`Toggle ${value}`}
      className={"p-0"}
    >
      {
        typeof propsValue === "string" ? (
          <div className={"size-full"} style={{ backgroundColor: propsValue }} />
        ) : typeof propsValue.icon === "string" ? (
          <img src={propsValue.icon} className={"size-full object-cover"} alt={value} />
        ) : (
          <propsValue.icon className={"size-full object-cover"} />
        )
      }
    </ToggleGroupItem>
  )
}

const AllActions: React.FC<MainToggleGroup> = ({ toolKey }) => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const selectedShapeId = useSelector((state: RootState) => state.app.selectedShapesId?._id);

  const dispatch = useDispatch();

  // Handler Function --
  const getUpdatedShapeProps = useCallback((updatedValue: Partial<AllToolBarProperties>) => {
    // Check --  The give property exits on the shape or not.
    const updatedProperties = getShapeProperties(
      [toolKey],
      updatedValue,
    );

    return {
      customProperties: { ...updatedValue },
      ...updatedProperties
    }
  }, [toolKey]);


  // Handler function -- 
  const handleValueChange = async (v: string | number) => {
    if (!v) return;

    if (toolKey === "opacity" || toolKey === "eraserRadius") {
      const isOpacity = toolKey === "opacity";

      if (isOpacity) {
        v = Number.parseFloat(v as string);
      } else {
        v = parseInt(v as string)
      }

      const min = isOpacity ? 0.15 : 10;
      const max = isOpacity ? 1 : 100;

      if (v as number <= min || v as number > max) return;
    }

    // Update the "ToolBarProperties" value
    dispatch(updateToolBarProperties({ [toolKey]: v }));

    if (selectedShapeId) {
      if (Array.isArray(selectedShapeId) && selectedShapeId?.length === 0) return;

      const ids = Array.isArray(selectedShapeId) ? selectedShapeId : [selectedShapeId];
      const generateUpdatedProps = ids.map((i) => {
        const updatedValue = getUpdatedShapeProps({ [toolKey]: v });

        return {
          shapeId: i,
          shapeValue: updatedValue
        }
      })

      // Calling API to update shape properties
      // await debounceHandleChange(generateUpdatedProps);
      dispatch(updateExistingShapes(generateUpdatedProps));
    }
  }

  const label = useMemo(() => {
    switch (toolKey) {
      case "fill":
        return "Background";
      case "fillStyle":
        return "Fill";
      case "stroke":
        return "Stroke";
      case "strokeStyle":
        return "Stroke Style";
      case "strokeWidth":
        return "Stroke Width";
      case "edgeStyle":
        return "Edge Style";
      case "opacity":
        return "Opacity";
      case "eraserRadius":
        return "Radius";
      case "fontSize":
        return "Font Size"
    }
  }, [toolKey])

  return (
    <Container label={label}>
      {
        toolKey === "opacity" || toolKey === "eraserRadius" ? (
          <input
            type="range"
            className={"w-full"}
            value={((selector ?? {})[toolKey] ?? 0)}
            min={toolKey === "eraserRadius" ? 10 : 0.15}
            max={toolKey === "eraserRadius" ? 100 : 1}
            step={toolKey === "eraserRadius" ? 1 : 0.01}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        ) : (
          <ToggleGroup
            type="single"
            className="gap-2"
            value={((selector ?? {})[toolKey] ?? "") as string}
            onValueChange={handleValueChange}
          >
            {
              ToolActionsProperties[toolKey].map((value, index) => {
                return (
                  <ToolItem key={index} propsValue={value} />
                )
              })
            }
          </ToggleGroup>
        )
      }

    </Container>
  )
}

export default AllActions;