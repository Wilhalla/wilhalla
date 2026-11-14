interface MapTapNavigatorProps {
  onStep: (direction: -1 | 1) => void;
}

const zone = "absolute top-16 bottom-24 z-10 w-1/4 touch-manipulation lg:hidden";

/**
 * On small screens the left and right quarter of the map step to the previous and next place.
 * A pointer shortcut only: the navigator below the map has the same buttons with their names.
 */
export function MapTapNavigator({ onStep }: MapTapNavigatorProps) {
  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={`${zone} left-0 cursor-w-resize`}
        onClick={() => onStep(-1)}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={`${zone} right-0 cursor-e-resize`}
        onClick={() => onStep(1)}
      />
    </>
  );
}
