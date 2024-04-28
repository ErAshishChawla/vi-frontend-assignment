import { CSSProperties } from "react";
import { Column } from "@tanstack/react-table";

export function useStyles(column: Column<any>): CSSProperties {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn = isPinned === "right" && column.getIsFirstColumn("right");

    return {
        boxShadow: isLastLeftPinnedColumn
            ? "-4px 0 4px -4px gray inset"
            : isFirstRightPinnedColumn
            ? "4px 0 4px -4px gray inset"
            : undefined,
        position: isPinned ? "sticky" : "relative",
        left: isPinned === "left" ? `${column.getStart()}px` : undefined,
        right: isPinned === "right" ? `${column.getAfter()}px` : undefined,
        width: column.getSize(),
        opacity: isPinned ? 1 : undefined,
        zIndex: isPinned ? 1 : 0,
    };
}
