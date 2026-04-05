/**
 * Mock for motion/react that renders components directly without animation.
 * This prevents jsdom animation issues (exit animations never completing) in tests.
 */
import React from 'react';

const MOTION_PROPS = new Set([
  'initial', 'animate', 'exit', 'transition', 'variants', 'layout', 'layoutId',
  'whileHover', 'whileTap', 'whileFocus', 'whileInView', 'whileDrag',
  'drag', 'dragConstraints', 'dragElastic', 'dragMomentum',
  'onAnimationStart', 'onAnimationComplete', 'onUpdate',
  'onDragStart', 'onDragEnd', 'onLayoutAnimationStart', 'onLayoutAnimationComplete',
]);

function stripMotionProps(props: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !MOTION_PROPS.has(key))
  );
}

const HTML_TAGS = [
  'a', 'article', 'aside', 'button', 'div', 'footer', 'form', 'h1', 'h2',
  'h3', 'h4', 'header', 'img', 'input', 'li', 'main', 'nav', 'p', 'section',
  'span', 'svg', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
];

type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

const motion = Object.fromEntries(
  HTML_TAGS.map((tag) => [
    tag,
    React.forwardRef<HTMLElement, AnyProps>(({ children, ...props }, ref) =>
      React.createElement(tag, { ...stripMotionProps(props), ref }, children)
    ),
  ])
) as Record<string, React.ForwardRefExoticComponent<AnyProps>>;

export const AnimatePresence = ({ children }: { children?: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

export { motion };
export default motion;
