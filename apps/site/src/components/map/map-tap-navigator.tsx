type MapTapNavigatorProps = {
  onNext: () => void;
  onPrevious: () => void;
};

export function MapTapNavigator({ onNext, onPrevious }: MapTapNavigatorProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Vorige plek"
        className="absolute top-16 bottom-24 left-0 z-10 w-1/4 cursor-w-resize touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-eggshell lg:hidden"
        onClick={onPrevious}
      />
      <button
        type="button"
        aria-label="Volgende plek"
        className="absolute top-16 right-0 bottom-24 z-10 w-1/4 cursor-e-resize touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-eggshell lg:hidden"
        onClick={onNext}
      />
    </>
  );
}
