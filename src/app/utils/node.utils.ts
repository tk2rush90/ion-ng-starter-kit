export const isNodeInClass = (node: Node, className: string): boolean => {
  let parentElement: Node | undefined | null = node;

  do {
    if (
      parentElement instanceof HTMLElement &&
      parentElement.classList.contains(className)
    ) {
      return true;
    }

    parentElement = parentElement?.parentElement;
  } while (parentElement);

  return false;
};
