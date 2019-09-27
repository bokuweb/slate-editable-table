import * as React from 'react';

export type ResizableProps = {
  maxWidth?: string;
  disableResizing?: boolean;
  onInit?: (v: ResizeValue) => void;
  onUpdate?: (v: ResizeValue) => void;
  onResizeStart?: (e: Event) => void;
  onResize?: (e: MouseEvent, v: ResizeValue) => void;
  onResizeStop?: (e: MouseEvent, v: ResizeValue) => void;
  onHandleHover?: () => void;
};

export type Cell = {
  x: number;
  width: number;
  colspan: number;
  ref: HTMLElement;
};

export type Row = {
  children: Cell[];
  ref: HTMLElement;
};

export type ResizeValue = {
  [key: string]: number;
};

const handlerSelector = '[data-resize-handle]';

export const useResizableTable = (props: ResizableProps) => {
  const ref = React.useRef<HTMLTableElement | null>(null);
  const createSize = () => {
    if (!ref.current) return;
    const table = ref.current;
    const cells = Array.from(table.querySelectorAll('th, td')) as HTMLElement[];
    return cells.reduce(
      (acc, cell) => {
        if (!cell.dataset || !cell.dataset.key) return acc;
        acc[cell.dataset.key] = cell.offsetWidth;
        return acc;
      },
      {} as { [key: string]: number },
    );
  };

  React.useEffect(() => {
    if (!props.disableResizing) return;
    document.querySelectorAll(handlerSelector).forEach(el => {
      el.parentNode && el.parentNode.removeChild(el);
    });
  }, [props.disableResizing]);

  React.useEffect(() => {
    if (!ref.current) return;
    const size = createSize();
    if (size) {
      props.onInit && props.onInit(size);
    }
  }, []);

  const update = () => {
    if (!ref.current) return;
    const size = createSize();
    if (size) {
      props.onUpdate && props.onUpdate(size);
    }
  };

  React.useEffect(() => {
    if (!ref.current) return;
    const table = ref.current;
    let isResizing = false;

    const onTableMouseOver = (e: MouseEvent) => {
      if (!e.target || !(e.target instanceof HTMLElement)) return;
      if (isResizing) return;
      const tagname = e.target.tagName.toLowerCase();
      if (tagname !== 'td' && tagname !== 'th') return;
      if (!parent) return;
      const firstRow = getFirstRow(table);
      if (!firstRow) return;

      Array.from(firstRow.children).forEach(el => {
        (el as HTMLElement).style.position = 'relative';
        const range = getRangeXOf(el as HTMLTableCellElement);
        if (!range) return;
        getBoundaries(table).forEach(boundary => {
          if (boundary > range.start && boundary <= range.end) {
            const div = createDiv(table.offsetHeight, boundary - range.start);
            el.appendChild(div);
            let pageX = 0;
            let resizedValues: ResizeValue = {};
            let rows: Row[] = [];

            const onMouseDown = (e: Event) => {
              e.preventDefault();
              if (!e.target || !(e instanceof MouseEvent)) return;
              removeHandles(table, e.target as HTMLElement);
              if (!!props.disableResizing) return;
              isResizing = true;
              rows = createRowData(table);
              pageX = e.pageX;
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
              props.onResizeStart && props.onResizeStart(e);
            };

            const onMouseMove = (e: MouseEvent) => {
              if (!isResizing) return;
              let diffX = e.pageX - pageX;
              resizedValues = updateCellWidths(rows, boundary, diffX, resizedValues);
              props.onResize && props.onResize(e, resizedValues);
            };

            const onMouseUp = (e: MouseEvent) => {
              isResizing = false;
              const diffX = e.pageX - pageX;
              resizedValues = updateCellWidths(rows, boundary, diffX, resizedValues);
              props.onResizeStop && props.onResizeStop(e, resizedValues);
              pageX = 0;
              removeHandles(table, e.relatedTarget as HTMLElement);
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            const onMouseOut = (e: MouseEvent) => {
              removeHandles(table, e.relatedTarget as HTMLElement);
              parent.removeEventListener('mouseout', onMouseOut);
              document.removeEventListener('mouseleave', onMouseLeave);
            };

            const onMouseLeave = (e: MouseEvent) => {
              isResizing = false;
              removeHandles(table, e.relatedTarget as HTMLElement);
              parent.removeEventListener('mouseout', onMouseOut);
              document.removeEventListener('mouseleave', onMouseLeave);
            };

            const onHandleMouseOver = (e: MouseEvent) => {
              props.onHandleHover && props.onHandleHover();
            };

            div.addEventListener('mousedown', onMouseDown);
            div.addEventListener('mouseover', onHandleMouseOver);
            parent.addEventListener('mouseout', onMouseOut);
            document.addEventListener('mouseleave', onMouseLeave);
          }
        });
      });
    };

    const onTableMouseOut = (e: MouseEvent) => {
      if (!(e.relatedTarget instanceof HTMLElement)) return;
      if (table.contains(e.relatedTarget)) return;
      table.querySelectorAll(handlerSelector).forEach(el => {
        el.parentNode && el.parentNode.removeChild(el);
      });
    };

    table.addEventListener('mouseover', onTableMouseOver);
    table.addEventListener('mouseout', onTableMouseOut);

    if (!!props.disableResizing) {
      table.removeEventListener('mouseover', onTableMouseOver);
      table.removeEventListener('mouseout', onTableMouseOut);
    }

    return () => {
      table.removeEventListener('mouseover', onTableMouseOver);
      table.removeEventListener('mouseout', onTableMouseOut);
    };
  }, [props.disableResizing, ref.current]);
  return { ref, update };
};

function updateCellWidths(rows: Row[], boundary: number, diffX: number, prev: ResizeValue): ResizeValue {
  const { value } = (rows || []).reduce(
    (acc, row) => {
      let hasCurrent = false;
      let hasNext = false;
      row.children.forEach(cell => {
        if (!cell.ref.dataset || !cell.ref.dataset.key) return acc;

        // If col merged and move inner slider, keep width.
        if (cell.colspan >= 2 && boundary < cell.x + cell.width && boundary > cell.x) {
          acc.value[cell.ref.dataset.key] = cell.width;
          cell.ref.style.width = `${cell.width}px`;
          return acc;
        }

        if (cell.x < boundary && cell.x + cell.width >= boundary) {
          if (!hasCurrent) {
            hasCurrent = true;
            // FIXME: pass minimumWidth option
            cell.ref.style.width = `${Math.max(cell.width + diffX, 32)}px`;
            acc.value[cell.ref.dataset.key] = cell.ref.offsetWidth;
            acc.saturated = cell.width + diffX <= 32;
            acc.adjust = prev[cell.ref.dataset.key] !== 32 ? 32 - cell.ref.offsetWidth : 0;
            return acc;
          }
        }

        if (hasCurrent && !hasNext) {
          hasNext = true;
          if (!acc.saturated) {
            cell.ref.style.width = `${Math.max(cell.width - diffX, 32)}px`;
            acc.value[cell.ref.dataset.key] = cell.ref.offsetWidth;
          } else {
            cell.ref.style.width = `${prev[cell.ref.dataset.key] - acc.adjust}px`;
            acc.value[cell.ref.dataset.key] = cell.ref.offsetWidth;
          }
          return acc;
        }
        cell.ref.style.width = `${cell.ref.offsetWidth}px`;
        acc.value[cell.ref.dataset.key] = cell.ref.offsetWidth;
        return acc;
      });
      return acc;
    },
    { value: {}, saturated: false, adjust: 0 } as { value: ResizeValue; saturated: boolean; adjust: number },
  );
  return value;
}

function createRowData(table: HTMLTableElement) {
  const t = getRows(table);
  const acc: { cell: HTMLTableCellElement; width: number }[][] = [];
  for (let y = 0; y < t.length; y++) {
    const row = t[y];
    for (let x = 0; x < row.children.length; x++) {
      const cell = row.children[x] as HTMLTableCellElement;
      if (!acc[y]) acc[y] = [];
      // skip
      let cx = x;
      while (acc[y][cx]) {
        cx++;
      }
      acc[y][cx] = { cell, width: cell.offsetWidth };
      for (let cy = 0; cy < cell.rowSpan - 1; cy++) {
        if (!acc[y + cy + 1]) acc[y + cy + 1] = [];
        acc[y + cy + 1][cx] = { cell, width: cell.offsetWidth };
      }
    }
  }
  return t.map((row, y) => {
    const { children } = acc[y].reduce(
      (acc, cell) => {
        const w = cell.width;
        const colspan = cell.cell.colSpan || 1;
        acc.children.push({ x: acc.x, width: w, colspan, ref: cell.cell });
        acc.x += w;
        return acc;
      },
      { children: [] as Cell[], x: 0 },
    );
    return { ref: row, children };
  });
}

function removeHandles(table: HTMLTableElement, target: HTMLElement) {
  table.querySelectorAll(handlerSelector).forEach(el => {
    if (el !== target) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  });
}

function getBoundaries(table: HTMLTableElement): number[] {
  const rows = Array.from(table.querySelectorAll('tr'));
  const layout: number[][] = [];

  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    if (!layout[y]) layout[y] = [];
    for (let x = 0; x < row.children.length; x++) {
      const cell = row.children[x] as HTMLTableCellElement;
      if (!cell) continue;
      let offset = 0;
      while (true) {
        if (!layout[y][x + offset]) {
          layout[y][x + offset] = cell.offsetWidth;
          break;
        }
        offset++;
      }
      for (let r = 1; r < (cell.rowSpan || 1); r++) {
        if (!layout[y + r]) layout[y + r] = [];
        layout[y + r][x] = cell.offsetWidth;
      }
    }
  }

  const dict: { [k: string]: boolean } = {};
  layout.forEach(row => {
    let x = 0;
    row.forEach(width => {
      dict[width + x] = true;
      x += width;
    });
  });

  return Object.keys(dict).map(Number);
}

function getRows(table: HTMLTableElement): HTMLElement[] {
  const cells = table.querySelectorAll('th, td');
  if (!cells) return [];
  const { rows } = Array.from(cells).reduce(
    (acc, cell) => {
      if (!cell.parentElement) return acc;
      if (acc.m.has(cell.parentElement)) return acc;
      acc.m.set(cell.parentElement, true);
      acc.rows.push(cell.parentElement);
      return acc;
    },
    { m: new Map<HTMLElement, boolean>(), rows: [] as HTMLElement[] },
  );
  return rows;
}

function getFirstRow(table: HTMLTableElement): HTMLElement | null {
  const cell = table.querySelector('th, td');
  if (!cell || !cell.parentElement) return null;
  return cell.parentElement;
}

function getRangeXOf(cell: HTMLElement): { start: number; end: number } | null {
  const row = cell.parentElement;
  if (!row) return null;
  const { range } = Array.from(row.children).reduce(
    (acc, e, i) => {
      if (!(e instanceof HTMLElement)) return acc;
      if (acc.reached) return acc;
      acc.range.start = i === 0 ? 0 : acc.range.end;
      acc.range.end = acc.range.start + e.offsetWidth;
      acc.reached = acc.reached || e === cell;
      return acc;
    },
    { range: { start: 0, end: 0 }, reached: false },
  );
  return range;
}

function createDiv(height: number | string, offset: number) {
  const div = document.createElement('div');
  div.style.top = '0';
  div.style.left = offset - 10 + 'px';
  div.style.width = '10px';
  div.style.position = 'absolute';
  div.style.cursor = 'col-resize';
  div.style.userSelect = 'none';
  div.style.height = height + 'px';
  div.dataset.resizeHandle = 'true';
  div.style.zIndex = '1';
  div.contentEditable = 'false';
  return div;
}
