import * as React from 'react';
import { Value } from 'slate';
import Html, { Rule } from 'slate-html-serializer';

import { defaultOptions } from '../option';

export function createHtml(v: Value, opts = defaultOptions) {
  const rules: Rule[] = [
    {
      serialize(obj: any, children: any) {
        switch (obj.type) {
          case 'paragraph':
            return <p style={{ margin: 0 }}>{children}</p>;
          case 'heading':
            return <h1>{children}</h1>;
          case 'subheading':
            return <h2>{children}</h2>;
          case opts.typeTable:
            return (
              <table>
                <tbody>{children}</tbody>
              </table>
            );
          case opts.typeRow:
            return <tr>{children}</tr>;
          case opts.typeCell:
            const width = typeof obj.data.get('width') === 'undefined' ? 'auto' : obj.data.get('width') + 'px';
            return (
              <td
                colSpan={obj.data.get('colspan')}
                rowSpan={obj.data.get('rowspan')}
                style={{
                  textAlign: obj.data.get('align'),
                  width,
                }}
              >
                {children}
              </td>
            );
          default:
            return null;
        }
      },
    },
  ];
  const h = new Html({ rules });
  return h.serialize(v);
}
