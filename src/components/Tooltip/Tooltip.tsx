import type { CSSProperties, HTMLProps, ReactElement, ReactNode } from "react";
import { cloneElement, useEffect, useRef, useState } from "react";
import {
  arrow, autoUpdate, flip, FloatingPortal, hide, offset, safePolygon, shift, size,
  useDismiss, useFloating, useFocus, useHover, useInteractions, useMergeRefs,
  useRole, useTransitionStatus,
} from "@floating-ui/react";
import "./Tooltip.css";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export type TooltipProps = {
  children: ReactElement;
  className?: string;
  content: ReactNode;
  disabled?: boolean;
  hideDelay?: number;
  placement?: TooltipPlacement;
  showDelay?: number;
};

const VIEWPORT_PADDING = 8;

export function Tooltip({
  children,
  className = "",
  content,
  disabled = false,
  hideDelay = 80,
  placement = "top",
  showDelay = 140,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const enabled = !disabled && content !== null && content !== undefined && content !== "";
  const { refs, floatingStyles, context, middlewareData, placement: resolvedPlacement, isPositioned, update } = useFloating({
    open: isOpen && enabled,
    onOpenChange: setIsOpen,
    placement,
    strategy: "fixed",
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, { animationFrame: true }),
    middleware: [
      offset(7),
      flip({ padding: VIEWPORT_PADDING, fallbackAxisSideDirection: "start" }),
      shift({ padding: VIEWPORT_PADDING }),
      size({
        padding: VIEWPORT_PADDING,
        apply({ availableWidth, availableHeight, elements }) {
          elements.floating.style.setProperty("--tooltip-max-width", `${Math.max(0, availableWidth)}px`);
          elements.floating.style.setProperty("--tooltip-max-height", `${Math.max(0, availableHeight)}px`);
        },
      }),
      arrow({ element: arrowRef, padding: 8 }),
      hide({ strategy: "referenceHidden" }),
    ],
  });
  const hover = useHover(context, {
    enabled,
    move: false,
    delay: { open: showDelay, close: hideDelay },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context, { enabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);
  const { isMounted, status } = useTransitionStatus(context, {
    duration: { open: 160, close: 120 },
  });
  const child = children as ReactElement<HTMLProps<HTMLElement>>;
  const ref = useMergeRefs([refs.setReference, child.props.ref]);

  // Reopening during the exit transition keeps the same floating element mounted.
  useEffect(() => {
    if (isOpen && enabled) update();
  }, [isOpen, enabled, update]);

  useEffect(() => {
    if (!enabled) setIsOpen(false);
  }, [enabled]);

  return (
    <>
      {cloneElement(child, getReferenceProps({ ...child.props, ref }))}
      {isMounted && (
        <FloatingPortal>
          <div
            {...getFloatingProps()}
            className="ui-tooltip__positioner"
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              visibility: !enabled || (isOpen && !isPositioned) || middlewareData.hide?.referenceHidden ? "hidden" : undefined,
              pointerEvents: isOpen && enabled ? "auto" : "none",
            }}
          >
            {/* Keep animation transforms separate from positioning and measurement. */}
            <div
              className={`ui-tooltip ui-tooltip--${resolvedPlacement} ${className}`}
              data-state={status}
              style={{
                "--tooltip-arrow-left": `${middlewareData.arrow?.x ?? 0}px`,
                "--tooltip-arrow-top": `${middlewareData.arrow?.y ?? 0}px`,
              } as CSSProperties}
            >
              <span className="ui-tooltip__content">{content}</span>
              <span aria-hidden="true" className="ui-tooltip__arrow" ref={arrowRef} />
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
