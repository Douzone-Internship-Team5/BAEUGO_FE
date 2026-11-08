"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

const moveItem = <K,>(list: K[], from: number, to: number) => {
  const next = list.filter((_, index) => index !== from);
  next.splice(to, 0, list[from]);
  return next;
};

/**
 * 손잡이를 끌어 목록 순서를 바꾸는 훅. 마우스와 터치 모두 Pointer Events로 처리한다.
 * 끄는 동안에는 미리보기 순서를 보여 주고, 놓으면 바뀐 순서로 onCommit을 한 번 부른다.
 * 손잡이에 포커스를 두고 ↑/↓ 키로도 한 칸씩 옮길 수 있다.
 */
export function useDragSort<K extends string | number>(keys: K[], onCommit: (next: K[]) => void, disabled = false) {
  const [drag, setDrag] = useState<{ key: K; order: K[] } | null>(null);
  const elements = useRef(new Map<K, HTMLElement>());
  const order = drag?.order ?? keys;

  const itemRef = (key: K) => (element: HTMLElement | null) => {
    if (element) elements.current.set(key, element);
    else elements.current.delete(key);
  };

  const handleProps = (key: K) => ({
    "aria-disabled": disabled,
    style: { touchAction: "none" as const },
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (disabled || event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setDrag({ key, order: keys });
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (!drag || drag.key !== key) return;
      // 끄는 항목을 뺀 나머지 중 가운데가 포인터보다 위에 있는 개수가 새 자리다.
      const rest = drag.order.filter((item) => item !== key);
      const target = rest.filter((item) => {
        const rect = elements.current.get(item)?.getBoundingClientRect();
        return rect ? rect.top + rect.height / 2 < event.clientY : false;
      }).length;
      const from = drag.order.indexOf(key);
      if (target !== from) setDrag({ key, order: moveItem(drag.order, from, target) });
    },
    onPointerUp: () => {
      if (!drag || drag.key !== key) return;
      const changed = drag.order.some((item, index) => item !== keys[index]);
      setDrag(null);
      if (changed) onCommit(drag.order);
    },
    onPointerCancel: () => setDrag(null),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (disabled || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
      event.preventDefault();
      const from = keys.indexOf(key);
      const to = event.key === "ArrowUp" ? from - 1 : from + 1;
      if (to < 0 || to >= keys.length) return;
      onCommit(moveItem(keys, from, to));
    },
  });

  return { order, draggingKey: drag?.key ?? null, itemRef, handleProps };
}
